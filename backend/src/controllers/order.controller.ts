import { sequelize } from './../sequelize';
import { Op } from 'sequelize';
import { Master } from './../models/master.model';
import { Client, ClientAttributes } from './../models/client.model';
import { City } from './../models/city.model';
import { Status } from './../models/status.model';
import { Order, OrderAttributes } from './../models/order.model';
import { Request, Response } from 'express';
import { validate } from '../validate';
import { sendConfMail } from '../mailer';

export default class OrderController {
    async addOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'email', 'masterId', 'cityId', 'watchSize', 'date', 'time']);
        if (error) return res.status(400).json(error);

        const { name, email, masterId, cityId, watchSize, date, time }: OrderAttributes & ClientAttributes = req.body;

        const overlapsOrders = await Order.findAll({
            where: {
                date,
                masterId,
                time: { [Op.between]: [time - 3 + 1, time + watchSize - 1] }
            }
        });
        if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

        const t = await sequelize.transaction();
        try {
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
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const order = await Order.findByPk(id);
            return res.status(200).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async updateOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'clientId', 'masterId', 'cityId', 'watchSize', 'date', 'time', 'statusId', 'rating']);
        if (error) return res.status(400).json(error);

        const { id, clientId, masterId, cityId, watchSize, date, time, statusId, rating }: OrderAttributes = req.body;

        const overlapsOrders = await Order.findAll({
            where: {
                date,
                masterId,
                time: { [Op.between]: [time - 3 + 1, time + watchSize - 1] }
            }
        });
        if (overlapsOrders.length !== 0) return res.status(400).json("The order overlaps with others. Select another master, date or time");

        try {
            const [order, created] = await Order.upsert({
                id, clientId, masterId, cityId, watchSize, date, time, statusId, rating
            });
            return res.status(200).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async changeStatus(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'statusId', 'rating']);
        if (error) return res.status(400).json(error);

        const { id, statusId, rating }: OrderAttributes = req.body;
        try {
            const [order, created] = await Order.upsert({
                id, statusId, rating
            });
            return res.status(200).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async deleteOrder(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const order = await Order.findByPk(id);
            await order.destroy();
            return res.status(200).json(order);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
