import { OrderSchema } from './../validationSchemas/order.schema';
import { MasterSchema } from './../validationSchemas/master.schema';
import { Order } from './../models/order.model';
import { sequelize } from './../sequelize';
import { Master } from './../models/master.model';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { City } from '../models/city.model';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        const optionalId = MasterSchema.partial({
            id: true,
        });
        try {
            const { name, cities } = optionalId.parse(req.body);

            const existCities = await City.findAll({
                where: {
                    id: cities
                }
            });
            if(existCities.length !== cities.length) return res.status(404).json('Some of the cities does not exist')

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
        try {
            const id = MasterSchema.shape.id.parse(+req.params.id);
            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');
            return res.status(200).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getAvailableMasters(req: Request, res: Response): Promise<Response> {
        const getAvailMastersSchema = OrderSchema.partial({
            id: true,
            rating: true,
            clientId: true,
            masterId: true,
            statusId: true
        });
        try {
            const { cityId, date, time, watchSize } = getAvailMastersSchema.parse(req.body);
            const orders = await Order.findAll({
                replacements: [+time],
                where: {
                    date: String(date),
                    time: {
                        [Op.and]:
                            [{ [Op.gte]: sequelize.literal('? - "Order"."watchSize" + 1') },
                            { [Op.lte]: +time + +watchSize - 1 }]
                    }
                }
            });
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
        try {
            const { id, name, cities } = MasterSchema.parse(req.body);

            const existMaster = await Master.findByPk(id);
            if (!existMaster) return res.status(404).json('No such master');

            const existCities = await City.findAll({
                where: {
                    id: cities
                }
            });
            if(existCities.length !== cities.length) return res.status(400).json('Some of the cities does not exist');

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
        try {
            const id = MasterSchema.shape.id.parse(+req.params.id);
            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');
            await master.destroy();
            return res.status(200).json(master);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
