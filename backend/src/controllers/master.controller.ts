import { Client } from './../models/client.model';
import { sendConfirmationUserMail, sendUserLoginInfoMail, sendMasterApprovedMail } from './../mailer';
import { generatePassword, encryptPassword } from './../password';
import { User, ROLES } from './../models/user.model';
import { City } from './../models/city.model';
import { AddMasterSchema, DeleteMasterSchema, GetMasterSchema, UpdateMasterSchema, GetFreeMastersSchema, AddMasterByAdminSchema } from './../validationSchemas/master.schema';
import { Order, WatchSizes } from './../models/order.model';
import { Master, MASTER_STATUSES } from './../models/master.model';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { sequelize } from '../sequelize';
import { v4 as uuidv4 } from 'uuid';

export default class MasterController {
    async addMaster(req: Request, res: Response): Promise<Response> {
        const addMasterTransaction = await sequelize.transaction();
        try {
            const { name, email, password, cities, status } = AddMasterSchema.parse(req.body);

            const existUser = await User.findOne({ where: { email } });
            if (existUser) return res.status(409).json('User with this email exist');

            const hash = encryptPassword(password);
            const confirmationToken = uuidv4();

            const existCities = await City.findAll({
                where: { id: cities }
            });
            if (existCities.length !== cities.length) return res.status(404).json('Some of the cities does not exist');

            const user = await User.create({
                email, password: hash, role: ROLES.MASTER, confirmationToken
            }, {
                transaction: addMasterTransaction
            });

            const master = await Master.create({ name, userId: user.getDataValue('id'), status }, {
                transaction: addMasterTransaction
            });
            // @ts-ignore
            await master.addCities(cities, {
                transaction: addMasterTransaction
            });

            await sendConfirmationUserMail(email, password, confirmationToken, name);

            await addMasterTransaction.commit();
            return res.status(201).json(master);
        } catch (error) {
            await addMasterTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async addMasterByAdmin(req: Request, res: Response): Promise<Response> {
        const addMasterTransaction = await sequelize.transaction();
        try {
            const { name, email, cities, status } = AddMasterByAdminSchema.parse(req.body);

            const existUser = await User.findOne({ where: { email } });
            if (existUser) return res.status(409).json('User with this email exist');

            const password = generatePassword();
            const hash = encryptPassword(password);
            const confirmationToken = uuidv4();

            const existCities = await City.findAll({
                where: { id: cities }
            });
            if (existCities.length !== cities.length) return res.status(404).json('Some of the cities does not exist');

            const user = await User.create({
                email, password: hash, role: ROLES.MASTER, confirmationToken
            }, {
                transaction: addMasterTransaction
            });

            const master = await Master.create({ name, userId: user.getDataValue('id'), status }, {
                transaction: addMasterTransaction
            });
            // @ts-ignore
            await master.addCities(cities, {
                transaction: addMasterTransaction
            });

            if (status === MASTER_STATUSES.NOT_CONFIRMED) {
                await sendConfirmationUserMail(email, password, confirmationToken, name);
            } else if (status === MASTER_STATUSES.CONFIRMED || status === MASTER_STATUSES.APPROVED) {
                await sendUserLoginInfoMail(email, password, name);
            }

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
                attributes: { include: [[sequelize.col('User.email'), 'email'], [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.fn('NULLIF', sequelize.col('rating'), 0)), 2), 'rating']] },
                include: [City, {
                    model: Order,
                    as: 'Order',
                    attributes: []
                }, {
                        model: User,
                        attributes: []
                    }],
                group: ['Master.id', 'Cities.id', 'Cities->CityMaster.id', 'User.email'],
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
            const master = await Master.findByPk(id, {
                attributes: { include: [[sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.fn('NULLIF', sequelize.col('rating'), 0)), 2), 'rating']] },
                include: [City, {
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id', 'Cities.id', 'Cities->CityMaster.id']
            });
            if (!master) return res.status(404).json('No such master');
            return res.status(200).json(master);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getMasterOrdersById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });

            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');

            const orders = await Order.findAll({
                where: {
                    masterId: id
                },
                attributes: ['id', [sequelize.col('Client.name'), 'client'], [sequelize.col('City.name'), 'city'], 'watchSize', 'date', 'time', 'endTime', 'price', 'status'],
                include: [{
                    model: City, attributes: []
                }, {
                    model: Client, attributes: []
                }],
                order: ['id']
            });
            return res.status(200).json(orders);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async getFreeMasters(req: Request, res: Response): Promise<Response> {
        try {
            const { cityId, date, time, watchSize } = GetFreeMastersSchema.parse(req.query);

            const endTime = time + WatchSizes[watchSize];

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
                    model: City,
                    as: 'Cities',
                    where: {
                        id: cityId
                    }
                },
                {
                    model: Order,
                    as: 'Order',
                    attributes: []
                }],
                group: ['Master.id', 'Cities.id', 'Cities->CityMaster.id']
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

            const { name, email, cities, status } = UpdateMasterSchema.parse(req.body);

            const existCities = await City.findAll({
                where: { id: cities }
            });
            if (existCities.length !== cities.length) return res.status(404).json('Some of the cities does not exist');

            const existUser = await User.findOne({ where: { email, id: { [Op.ne]: master.getDataValue('userId') } } });
            if (existUser) return res.status(409).json('User with this email exist');

            await User.update({ email }, { where: { id: master.getDataValue('userId') }, transaction: updateMasterTransaction })

            if(master.getDataValue('status') !== MASTER_STATUSES.APPROVED && status === MASTER_STATUSES.APPROVED) {
                await sendMasterApprovedMail(email, name);
            }
            
            await master.update({ name, status }, { transaction: updateMasterTransaction });


            // @ts-ignore
            await master.setCities(cities, {
                transaction: updateMasterTransaction
            });

            await updateMasterTransaction.commit();
            return res.status(200).json(master);
        } catch (error) {
            await updateMasterTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async deleteMaster(req: Request, res: Response): Promise<Response> {
        const deleteMasterTransaction = await sequelize.transaction();
        try {
            const { id } = DeleteMasterSchema.parse({ id: +req.params.id });
            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');

            const user = await User.findByPk(master.getDataValue('userId'));

            await master.destroy({ transaction: deleteMasterTransaction });
            await user.destroy({ transaction: deleteMasterTransaction });

            await deleteMasterTransaction.commit();
            return res.status(200).json(master);
        } catch (error) {
            await deleteMasterTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
