import { sequelize } from './../sequelize';
import { CityMaster } from './../models/cityMaster.model';
import { Client } from './../models/client.model';
import { sendConfirmationUserMail, sendUserLoginInfoMail, sendMasterApprovedMail } from './../mailer';
import { generatePassword, encryptPassword } from './../password';
import { User, ROLES } from './../models/user.model';
import { City } from './../models/city.model';
import { AddMasterSchema, DeleteMasterSchema, GetMasterSchema, UpdateMasterSchema, GetFreeMastersSchema, AddMasterByAdminSchema, GetMastersSchema } from './../validationSchemas/master.schema';
import { Order, WatchSizes } from './../models/order.model';
import { Master, MASTER_STATUSES, MasterAttributes, MasterCreationAttributes } from './../models/master.model';
import { Request, Response } from 'express';
import { Attributes, FindAndCountOptions, Op, Model } from 'sequelize';
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
            return res.sendStatus(500);
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
            return res.sendStatus(500);
        }
    }
    async getMasters(req: Request, res: Response): Promise<Response> {
        try {
            let statusesQuery: string[], citiesQuery: number[];
            if (req.query.statuses) statusesQuery = req.query.statuses.toString().split(',');
            if (req.query.cities) citiesQuery = req.query.cities.toString().split(',').map(cityId => +cityId);

            const { limit, page, cities, statuses } = GetMastersSchema.parse({ ...req.query, statuses: statusesQuery, cities: citiesQuery });

            const config: FindAndCountOptions<Attributes<Model<MasterAttributes, MasterCreationAttributes>>> = {
                attributes: { include: [[sequelize.col('User.email'), 'email']] },
                include: [{
                    model: City,
                    as: 'Cities',
                    required: true
                }, {
                    model: User,
                    attributes: [],
                    duplicating: false,
                    required: true
                }],
                where: {},
                order: ['id'],
                limit: limit || 25,
                offset: limit * (page - 1) || 0,
                distinct: true
            }
            if (statuses) {
                config.where = {
                    ...config.where,
                    status: statuses
                }
            }
            if (cities) {
                const associations = await CityMaster.findAll({
                    attributes: ['masterId', [sequelize.fn('count', sequelize.col('masterId')), 'cities']],
                    where: {
                        cityId: cities
                    },
                    group: ['masterId']
                });
                const mastersByCities = associations.filter(association => association.getDataValue('cities') >= cities.length).map(as => as.toJSON().masterId);
                config.where = {
                    ...config.where,
                    id: mastersByCities
                }
            }

            const { count, rows } = await Master.findAndCountAll(config);

            return res.status(200).json({ count, rows });
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
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
            return res.sendStatus(500);
        }
    }
    async getMasterOrdersById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetMasterSchema.parse({ id: +req.params.id });

            const master = await Master.findByPk(id);
            if (!master) return res.status(404).json('No such master');

            const { limit, page } = GetMastersSchema.parse(req.query);

            const { count, rows } = await Order.findAndCountAll({
                where: {
                    masterId: id
                },
                attributes: ['id', [sequelize.col('Client.name'), 'client'], [sequelize.col('City.name'), 'city'], 'watchSize', 'date', 'time', 'endTime', 'price', 'status'],
                include: [{
                    model: City, attributes: []
                }, {
                    model: Client, attributes: []
                }],
                order: [['date', 'DESC']],
                limit: limit || 25,
                offset: limit * (page - 1) || 0
            });
            return res.status(200).json({ count, rows });
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
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
            return res.sendStatus(500);
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

            if (master.getDataValue('status') !== MASTER_STATUSES.APPROVED && status === MASTER_STATUSES.APPROVED) {
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
            return res.sendStatus(500);
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
            return res.sendStatus(500);
        }
    }
}
