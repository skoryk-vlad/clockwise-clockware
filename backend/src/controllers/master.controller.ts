import { AddMasterSchema, DeleteMasterSchema, GetMasterSchema, UpdateMasterSchema, GetFreeMastersSchema } from './../validationSchemas/master.schema';
import { Order } from './../models/order.model';
import { sequelize } from './../sequelize';
import { Master } from './../models/master.model';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { City } from '../models/city.model';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { name, cities } = AddMasterSchema.parse(req.body);

            const existCities = await City.findAll({
                where: {
                    id: cities
                }
            });
            if(existCities.length !== cities.length) return res.status(404).json('Some of the cities does not exist')

            const master = await Master.create({ name, cities });
            return res.status(201).json(master);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
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
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async getMasterById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });
            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');
            return res.status(200).json(master);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getFreeMasters(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId, date, time, watchSize } = GetFreeMastersSchema.parse(req.query);
            
            const overlapsOrders = await Order.findAll({
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
            const freeMasters = await Master.findAll({
                where: {
                    cities: {
                        [Op.contains]: [+cityId]
                    },
                    id: { [Op.notIn]: overlapsOrders.map(order => order.getDataValue('masterId')) }
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
            return res.status(200).json(freeMasters);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async updateMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });

            const existMaster = await Master.findByPk(id);
            if (!existMaster) return res.status(404).json('No such master');
            
            const { name, cities } = UpdateMasterSchema.parse(req.body);

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
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async deleteMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteMasterSchema.parse({ id: +req.params.id });
            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');
            await master.destroy();
            return res.status(200).json(master);
        } catch (error) {
            if(error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
