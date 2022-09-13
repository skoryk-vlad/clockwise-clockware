import { CityMaster } from './../models/cityMaster.model';
import { AddMasterSchema, DeleteMasterSchema, GetMasterSchema, UpdateMasterSchema, GetFreeMastersSchema } from './../validationSchemas/master.schema';
import { Order, WATCH_SIZES } from './../models/order.model';
import { Master } from './../models/master.model';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../sequelize';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        const addMasterTransaction = await sequelize.transaction();
        try {
            const { name, cities } = AddMasterSchema.parse(req.body);

            const master = await Master.create({ name }, {
                transaction: addMasterTransaction
            });
            await cities.reduce(async (promise, city) => {
                await promise;
                await CityMaster.create({ cityId: city, masterId: master.getDataValue('id') }, {
                    transaction: addMasterTransaction
                });
            }, Promise.resolve());
            await addMasterTransaction.commit();
            return res.status(201).json(master);
        } catch (error) {
            await addMasterTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getMasters(req: Request, res: Response): Promise<Response> {
        try {
            const masters = await Master.findAll({
                attributes: { include: [[sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.fn('NULLIF', sequelize.col('rating'), 0)), 2), 'rating']] },
                include: [{
                    model: CityMaster,
                    as: 'CityMaster',
                    attributes: ['cityId']
                },
                {
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id', 'CityMaster.id'],
                order: ['id']
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
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getFreeMasters(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId, date, time, watchSize } = GetFreeMastersSchema.parse(req.query);

            const endTime = time + Object.values(WATCH_SIZES).indexOf(watchSize);

            const overlapsOrders = await Order.findAll({
                where: {
                    date,
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
            const freeMasters = await Master.findAll({
                where: {
                    id: { [Op.notIn]: overlapsOrders.map(overlapsOrder => overlapsOrder.getDataValue('masterId')) }
                },
                attributes: { include: [[sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.fn('NULLIF', sequelize.col('rating'), 0)), 2), 'rating']] },
                include: [{
                    model: CityMaster,
                    as: 'CityMaster',
                    where: {
                        cityId
                    }
                },
                {
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id', 'CityMaster.id']
            });

            return res.status(200).json(freeMasters);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async updateMaster(req: Request, res: Response): Promise<Response> {
        const updateMasterTransaction = await sequelize.transaction();
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });

            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');


            const { name, cities } = UpdateMasterSchema.parse(req.body);

            if (master.getDataValue('name') !== name) {
                master.update({ name });
            }
            await CityMaster.destroy({
                where: {
                    masterId: id
                }
            })
            await cities.reduce(async (promise, city) => {
                await promise;
                await CityMaster.upsert({ cityId: city, masterId: id }, {
                    transaction: updateMasterTransaction,
                    conflictFields: ['cityId', 'masterId'],
                    returning: ['cityId', 'masterId']
                });
            }, Promise.resolve());

            await updateMasterTransaction.commit();
            return res.status(200).json(master);
        } catch (error) {
            await updateMasterTransaction.rollback();
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
