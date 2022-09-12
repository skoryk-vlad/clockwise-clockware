import { CityMaster } from './../models/cityMaster.model';
import { AddMasterSchema, DeleteMasterSchema, GetMasterSchema, UpdateMasterSchema, GetFreeMastersSchema } from './../validationSchemas/master.schema';
import { Order } from './../models/order.model';
import { Master } from './../models/master.model';
import { Request, Response } from 'express';
import { Op } from 'sequelize';

const watchSizes = ['small', 'medium', 'big'];

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { name } = AddMasterSchema.parse(req.body);

            const master = await Master.create({ name });
            return res.status(201).json(master);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getMasters(req: Request, res: Response): Promise<Response> {
        try {
            const masters = await Master.findAll();
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
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getFreeMasters(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId, date, time, watchSize } = GetFreeMastersSchema.parse(req.query);

            const endTime = time + watchSizes.indexOf(watchSize);

            const overlapsOrders = await Order.findAll({
                where: {
                    date,
                    [Op.or]: [
                        { time: { [Op.between]: [time, endTime] } },
                        { endTime: { [Op.between]: [time, endTime] } }
                    ]
                },
                include: [{
                    model: CityMaster,
                    as: 'CityMaster'
                }]
            });

            const cityMasters = await CityMaster.findAll({
                attributes: ['masterId'],
                where: {
                    id: overlapsOrders.map(overlapsOrder => overlapsOrder.getDataValue('cityMasterId'))
                }
            });

            const freeMasters = await Master.findAll({
                where: {
                    id: { [Op.notIn]: cityMasters.map(cityMaster => cityMaster.getDataValue('masterId'))}
                },
                include: [{
                    model: CityMaster,
                    as: 'CityMaster',
                    where: {
                        cityId
                    }
                }]
            });

            return res.status(200).json(freeMasters);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async updateMaster(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });

            const existMaster = await Master.findByPk(id);
            if (!existMaster) return res.status(404).json('No such master');

            const { name } = UpdateMasterSchema.parse(req.body);

            const [master, created] = await Master.upsert({
                id,
                name
            });
            return res.status(200).json(master);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
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
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
