import { ROLES, User } from './../models/user.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddOrderSchema, ChangeStatusSchema, DeleteOrderSchema, GetOrderSchema, UpdateOrderSchema } from './../validationSchemas/order.schema';
import { sequelize } from './../sequelize';
import { FindOptions, Op } from 'sequelize';
import { Master } from './../models/master.model';
import { Client } from './../models/client.model';
import { City } from './../models/city.model';
import { Order, WatchSizes } from './../models/order.model';
import { Request, Response } from 'express';
import { sendConfirmOrderMail } from '../mailer';
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

            // const [client, created] = await Client.upsert({
            //     email, name
            // }, {
            //     conflictFields: ['email'],
            //     transaction: addOrderTransaction
            // });
            const user = await User.findOne({ where: { email } });
            const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
            // const [client, created] = await Client.upsert({
            //     name, userId: user.getDataValue('id')
            // }, {
            //     conflictFields: ['email'],
            //     transaction: addOrderTransaction
            // });
            const confirmationToken = uuidv4();
            const price = existCity.getDataValue('price') * (endTime - time);

            const order = await Order.create({
                watchSize, date, time, masterId, cityId, clientId: client.getDataValue('id'), status, endTime, confirmationToken, price
            }, {
                transaction: addOrderTransaction
            });

            await sendConfirmOrderMail(email, confirmationToken, name);
            await addOrderTransaction.commit();
            return res.status(201).json(order);
        } catch (error) {
            console.log(error);

            await addOrderTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        const { role, id } = req.query;
        const config: FindOptions = {
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
        };
        if (role && id) {
            if (role === ROLES.MASTER) {
                config.where = {
                    masterId: id
                };
                config.attributes = ['id', [sequelize.col('Client.name'), 'client'], [sequelize.col('City.name'), 'city'], 'watchSize', 'date', 'time', 'endTime', 'price', 'status'];
                config.include = [{
                    model: City, attributes: []
                }, {
                    model: Client, attributes: []
                }];
            }
            if (role === ROLES.CLIENT) {
                config.where = {
                    clientId: id
                };
                config.attributes = ['id', [sequelize.col('Master.name'), 'master'], 'watchSize', 'date', 'time', 'endTime', 'price', 'status'];
                config.include = [{
                    model: Master, attributes: []
                }];
            }
        }

        try {
            const orders = await Order.findAll(config);

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
            const { id, status, rating } = ChangeStatusSchema.parse(req.body);

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            await order.update({ status, rating });
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
