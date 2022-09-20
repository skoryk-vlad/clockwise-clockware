import { ROLES, User } from './../models/user.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddOrderSchema, ChangeStatusSchema, DeleteOrderSchema, GetOrderSchema, UpdateOrderSchema, SetRatingSchema } from './../validationSchemas/order.schema';
import { sequelize } from './../sequelize';
import { Model, Op } from 'sequelize';
import { Master } from './../models/master.model';
import { Client, CLIENT_STATUSES, ClientAttributes, ClientCreationAttributes } from './../models/client.model';
import { City } from './../models/city.model';
import { Order, ORDER_STATUSES, WatchSizes } from './../models/order.model';
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
            return res.status(500).json(error);
        }
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.findAll({
                include:
                    [
                        {
                            model: City,
                            as: 'City'
                        },
                        {
                            model: Master,
                            as: 'Master'
                        },
                        {
                            model: Client,
                            as: 'Client'
                        }
                    ],
                order: ['id']
            });

            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json(error);
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
            return res.status(500).json(error);
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
            return res.status(500).json(error);
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
            return res.status(500).json(error);
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
            return res.status(500).json(error);
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
            return res.status(500).json(error);
        }
    }
}
