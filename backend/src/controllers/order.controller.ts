import { ROLES, User } from './../models/user.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddOrderSchema, ChangeStatusSchema, DeleteOrderSchema, GetOrderSchema, UpdateOrderSchema, SetRatingSchema, GetOrdersSchema } from './../validationSchemas/order.schema';
import { sequelize } from './../sequelize';
import { Model, Op, FindAndCountOptions, Attributes } from 'sequelize';
import { Master } from './../models/master.model';
import { Client, CLIENT_STATUSES, ClientAttributes, ClientCreationAttributes } from './../models/client.model';
import { City } from './../models/city.model';
import { Order, ORDER_STATUSES, WatchSizes, OrderAttributes, OrderCreationAttributes } from './../models/order.model';
import { Request, Response } from 'express';
import { sendConfirmationOrderMail } from '../mailer';
import { v4 as uuidv4 } from 'uuid';

export default class OrderController {
    async addOrder(req: Request, res: Response): Promise<Response> {
        const addOrderTransaction = await sequelize.transaction();
        try {
            const { name, email, masterId, cityId, watchSize, date, time, status } = AddOrderSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');
            const existCityMaster = await CityMaster.findOne({ where: { cityId, masterId } });
            if (!existCityMaster) return res.status(404).json('No such city and master relation');

            const endTime = time + WatchSizes[watchSize];

            const overlapsOrders = await Order.findAll({
                where: {
                    date,
                    masterId,
                    [Op.or]: [
                        { time: { [Op.between]: [time, endTime] } },
                        { endTime: { [Op.between]: [time, endTime] } },
                        {
                            [Op.and]: [
                                { time: { [Op.lt]: time } },
                                { endTime: { [Op.gt]: endTime } },
                            ]
                        }
                    ]
                }
            });
            if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

            let user = await User.findOne({ where: { email } });
            let client: Model<ClientAttributes, ClientCreationAttributes>;
            if (!user) {
                const confirmationToken = uuidv4();
                user = await User.create({
                    email, role: ROLES.CLIENT, confirmationToken
                }, {
                    transaction: addOrderTransaction
                });
                client = await Client.create({
                    name, userId: user.getDataValue('id'), status: CLIENT_STATUSES.NOT_CONFIRMED
                }, {
                    transaction: addOrderTransaction
                });
            } else {
                client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                if (name !== client.getDataValue('name')) {
                    await client.update({ name }, { transaction: addOrderTransaction });
                }
            }

            const confirmationToken = uuidv4();
            const price = existCity.getDataValue('price') * (endTime - time);

            const order = await Order.create({
                watchSize, date, time, masterId, cityId, clientId: client.getDataValue('id'), status, endTime, confirmationToken, price
            }, {
                transaction: addOrderTransaction
            });

            await sendConfirmationOrderMail(email, confirmationToken, name);
            await addOrderTransaction.commit();
            return res.status(201).json(order);
        } catch (error) {
            await addOrderTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const { limit, page, cities, masters, statuses, dateStart, dateEnd } = GetOrdersSchema.parse(req.query);

            let include = [
                { model: City, as: 'City', where: {} },
                { model: Master, as: 'Master', where: {} },
                { model: Client, as: 'Client' }
            ];

            if (cities) {
                include = [...include,
                {
                    model: City,
                    as: 'City',
                    where: {
                        id: cities
                    }
                }]
            }
            if (masters) {
                include = [...include,
                {
                    model: Master,
                    as: 'Master',
                    where: {
                        id: masters
                    }
                }]
            }

            const config: FindAndCountOptions<Attributes<Model<OrderAttributes, OrderCreationAttributes>>> = {
                include,
                order: [['date', 'DESC']],
                limit: limit || 100,
                offset: limit * (page - 1) || 0,
                distinct: true
            }
            if (statuses) {
                config.where = {
                    ...config.where,
                    status: statuses
                }
            }
            if (dateStart || dateEnd) {
                const dateConditions = [];
                if (dateStart) dateConditions.push({ [Op.gte]: dateStart });
                if (dateEnd) dateConditions.push({ [Op.lte]: dateEnd });
                config.where = {
                    ...config.where,
                    date: {
                        [Op.and]: dateConditions
                    }
                }
            }

            const { count, rows } = await Order.findAndCountAll(config);

            return res.status(200).json({ count, rows });
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({ id: +req.params.id });
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async updateOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({ id: +req.params.id });

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');

            const { clientId, masterId, cityId, watchSize, date, time, status, rating } = UpdateOrderSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');
            const existClient = await Client.findByPk(clientId);
            if (!existClient) return res.status(404).json('No such client');
            const existCityMaster = await CityMaster.findOne({ where: { cityId, masterId } });
            if (!existCityMaster) return res.status(404).json('No such city and master relation');

            const endTime = time + WatchSizes[watchSize];

            const overlapsOrders = await Order.findAll({
                where: {
                    id: { [Op.ne]: id },
                    date,
                    masterId,
                    [Op.or]: [
                        { time: { [Op.between]: [time, endTime] } },
                        { endTime: { [Op.between]: [time, endTime] } },
                        {
                            [Op.and]: [
                                { time: { [Op.lt]: time } },
                                { endTime: { [Op.gt]: endTime } },
                            ]
                        }
                    ]
                }
            });
            if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

            const price = existCity.getDataValue('price') * (endTime - time);

            await order.update({
                clientId, masterId, cityId, watchSize, date, time, status, rating, endTime, price
            });
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async changeStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({ id: +req.params.id });

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');

            const { status } = ChangeStatusSchema.parse(req.body);
            await order.update({ status });
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async setRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({ id: +req.params.id });

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            if (order.getDataValue('status') !== ORDER_STATUSES.COMPLETED) return res.status(409).json('Order not completed');

            const { rating } = SetRatingSchema.parse(req.body);
            if (order.getDataValue('rating')) return res.status(409).json('Rating already set');
            await order.update({ rating });
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async deleteOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteOrderSchema.parse({ id: +req.params.id });
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            await order.destroy();
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
