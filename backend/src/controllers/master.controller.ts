import { Order } from './../models/order.model';
import { sequelize } from './../sequelize';
import { Master, MasterAttributes } from './../models/master.model';
import { Request, Response } from 'express';
import { validate } from './../validate';
import { Op } from 'sequelize';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'cities']);
        if (error) return res.status(400).json(error);

        const { name, cities }: MasterAttributes = req.body;

        try {
            const master = await Master.create({ name, cities });
            return res.status(201).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getMasters(req: Request, res: Response): Promise<Response> {
        try {
            const masters = await Master.findAll({
                attributes: [
                    'id', 'name', 'cities', 'createdAt', 'updatedAt',
                    [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('rating')), 2), 'rating']
                ],
                include: [{
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id'],
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(masters);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getMasterById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const master = await Master.findByPk(id);
            return res.status(200).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getAvailableMasters(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.query, ['cityId', 'date', 'time', 'watchSize']);

        if (error) return res.status(400).json(error);

        const { cityId, date, time, watchSize } = req.query;
        try {
            let orders = await Order.findAll({
                where: {
                    date: String(date),
                    time: { 
                        [Op.and]:
                            [{ [Op.gte]: +time - 3 + 1 },
                            { [Op.lte]: +time + +watchSize - 1 }]
                    }
                }
            });
            orders = orders.filter(o => o.getDataValue('time') >= +time - o.getDataValue('watchSize') + 1);
            const masters = await Master.findAll({
                where: {
                    cities: {
                        [Op.contains]: [+cityId]
                    },
                    id: { [Op.notIn]: orders.map(o => o.getDataValue('masterId')) }
                },
                attributes: [
                    'id', 'name',
                    [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('rating')), 2), 'rating']
                ],
                include: [{
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id']
            });
            return res.status(200).json(masters);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async updateMaster(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name', 'cities']);
        if (error) return res.status(400).json(error);

        const { id, name, cities }: MasterAttributes = req.body;
        try {
            const [master, created] = await Master.upsert({
                id,
                name,
                cities
            });
            return res.status(200).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async deleteMaster(req: Request, res: Response): Promise<Response> {
        let error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const master = await Master.findByPk(id);
            await master.destroy();
            return res.status(200).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
