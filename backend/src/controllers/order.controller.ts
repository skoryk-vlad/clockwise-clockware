import { AddOrderSchema, ChangeStatusSchema, DeleteOrderSchema, GetOrderSchema, UpdateOrderSchema } from './../validationSchemas/order.schema';
import { sequelize } from './../sequelize';
import { Op } from 'sequelize';
import { Master } from './../models/master.model';
import { Client } from './../models/client.model';
import { City } from './../models/city.model';
import { Status } from './../models/status.model';
import { Order } from './../models/order.model';
import { Request, Response } from 'express';
import { sendConfMail } from '../mailer';

export default class OrderController {
    async addOrder(req: Request, res: Response): Promise<Response> {
        const t = await sequelize.transaction();
        try {
            const { name, email, masterId, cityId, watchSize, date, time } = AddOrderSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');

            const overlapsOrders = await Order.findAll({
                replacements: [time],
                where: {
                    date,
                    masterId,
                    time: {
                        [Op.and]:
                            [{ [Op.gte]: sequelize.literal('? - "Order"."watchSize" + 1') },
                            { [Op.lte]: +time + +watchSize - 1 }]
                    }
                }
            });
            if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

            const [client, created] = await Client.upsert({
                email, name
            }, {
                conflictFields: ['email'],
                transaction: t
            });

            const order = await Order.create({
                watchSize, date, time, cityId, clientId: client.getDataValue('id'), masterId
            }, {
                transaction: t
            });
            await sendConfMail(email, order.getDataValue('id'), name);
            await t.commit();
            return res.status(201).json(order);
        } catch (e) {
            await t.rollback();
            if(e?.name === "ZodError") return res.status(400).json(e.issues);
            return res.status(500).json(e);
        }
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const orders = await Order.findAll({
                include:
                    [
                        {
                            model: City,
                            as: 'City',
                            attributes: ['id', 'name']
                        },
                        {
                            model: Client,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Master,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Status,
                            attributes: ['id', 'name']
                        },
                    ],
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(orders);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({id: +req.params.id});
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            return res.status(200).json(order);
        } catch (e) {
            if(e?.name === "ZodError") return res.status(400).json(e.issues);
            return res.status(500).json(e);
        }
    }
    async updateOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse({id: +req.params.id});
            
            const existOrder = await Order.findByPk(id);
            if (!existOrder) return res.status(404).json('No such order');

            const { clientId, masterId, cityId, watchSize, date, time, statusId, rating } = UpdateOrderSchema.parse(req.body);

            const existCity = await City.findByPk(cityId);
            if (!existCity) return res.status(404).json('No such city');
            const existMaster = await Master.findByPk(masterId);
            if (!existMaster) return res.status(404).json('No such master');
            const existClient = await Client.findByPk(clientId);
            if (!existClient) return res.status(404).json('No such client');

            const overlapsOrders = await Order.findAll({
                replacements: [time],
                where: {
                    date,
                    masterId,
                    time: {
                        [Op.and]:
                            [{ [Op.gte]: sequelize.literal('? - "Order"."watchSize" + 1') },
                            { [Op.lte]: +time + +watchSize - 1 }]
                    }
                }
            });
            if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

            const [order, created] = await Order.upsert({
                id, clientId, masterId, cityId, watchSize, date, time, statusId, rating
            });
            return res.status(200).json(order);
        } catch (e) {
            if(e?.name === "ZodError") return res.status(400).json(e.issues);
            return res.status(500).json(e);
        }
    }
    async changeStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id, statusId, rating } = ChangeStatusSchema.parse(req.body);
            const [order, created] = await Order.upsert({
                id, statusId, rating
            });
            return res.status(200).json(order);
        } catch (e) {
            if(e?.name === "ZodError") return res.status(400).json(e.issues);
            return res.status(500).json(e);
        }
    }
    async deleteOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteOrderSchema.parse({id: +req.params.id});
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            await order.destroy();
            return res.status(200).json(order);
        } catch (e) {
            if(e?.name === "ZodError") return res.status(400).json(e.issues);
            return res.status(500).json(e);
        }
    }
}
