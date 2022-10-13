import { uploadStream } from './../services/cloudinary';
import { ROLES, User } from './../models/user.model';
import { CityMaster } from './../models/cityMaster.model';
import { AddOrderSchema, ChangeStatusSchema, DeleteOrderSchema, GetOrderSchema, UpdateOrderSchema, SetRatingSchema, GetOrdersSchema, addReviewSchema, addImagesSchema } from './../validationSchemas/order.schema';
import { sequelize } from './../sequelize';
import { Model, Op, FindAndCountOptions, Attributes, FindOptions } from 'sequelize';
import { Master } from './../models/master.model';
import { Client, CLIENT_STATUSES, ClientAttributes, ClientCreationAttributes } from './../models/client.model';
import { City } from './../models/city.model';
import { Order, ORDER_STATUSES, WatchSizes, OrderAttributes, OrderCreationAttributes } from './../models/order.model';
import { Request, Response } from 'express';
import { sendConfirmationOrderMail, sendOrderCompletedMail } from '../services/mailer';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import { createOrderReport } from '../reports';

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

            let user = await User.findOne({ where: { email } });
            let client: Model<ClientAttributes, ClientCreationAttributes>;
            if (!user) {
                const confirmationToken = uuidv4();
                user = await User.create({
                    email, role: ROLES.CLIENT, confirmationToken
                }, {
                    transaction: addOrderTransaction
                });
                client = await Client.create({
                    name, userId: user.getDataValue('id'), status: CLIENT_STATUSES.NOT_CONFIRMED
                }, {
                    transaction: addOrderTransaction
                });
            } else {
                client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                if (name !== client.getDataValue('name')) {
                    await client.update({ name }, { transaction: addOrderTransaction });
                }
            }
            const reviewToken = uuidv4();
            const price = existCity.getDataValue('price') * (endTime - time);

            let imagesLinks: string[] = [];
            if (req.files && req.files.length) {
                const files = addImagesSchema.parse(req.files);

                imagesLinks = await Promise.all(Object.keys(files).map(async (index) => (await uploadStream(files[index].buffer, {
                    unique_filename: true, folder: process.env.CLOUDINARY_FOLDER
                })).secure_url));
            }

            const order = await Order.create({
                watchSize, date, time, masterId, cityId, clientId: client.getDataValue('id'), status, endTime, price, reviewToken, imagesLinks
            }, {
                transaction: addOrderTransaction
            });

            await sendConfirmationOrderMail(email, name, order.get(), existMaster.getDataValue('name'));

            await addOrderTransaction.commit();
            return res.status(201).json(order);
        } catch (error) {
            await addOrderTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getOrders(req: Request, res: Response): Promise<Response> {
        try {
            const { limit, page, cities, masters, clients, statuses, dateStart, dateEnd, sortedField, isDirectedASC, priceRange } = GetOrdersSchema.parse(req.query);

            let include = [
                { model: City, as: 'City', where: {} },
                { model: Master, as: 'Master', where: {} },
                { model: Client, as: 'Client', where: {} }
            ];

            if (cities) {
                include = [...include,
                {
                    model: City,
                    as: 'City',
                    where: {
                        id: cities
                    }
                }]
            }
            if (masters) {
                include = [...include,
                {
                    model: Master,
                    as: 'Master',
                    where: {
                        id: masters
                    }
                }]
            }
            if (clients) {
                include = [...include,
                {
                    model: Client,
                    as: 'Client',
                    where: {
                        id: clients
                    }
                }]
            }
            const config: FindAndCountOptions<Attributes<Model<OrderAttributes, OrderCreationAttributes>>> = {
                attributes: {
                    include: [[sequelize.col('City.name'), 'city'],
                    [sequelize.col('Client.name'), 'client'],
                    [sequelize.col('Master.name'), 'master']]
                },
                include,
                order: [[
                    sortedField || 'date',
                    isDirectedASC ? 'ASC' : 'DESC']],
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
            if (priceRange) {
                config.where = {
                    ...config.where,
                    price: { [Op.between]: [priceRange[0], priceRange[1]] }
                }
            }
            if (dateStart || dateEnd) {
                const dateConditions = [];
                if (dateStart) dateConditions.push({ [Op.gte]: dateStart });
                if (dateEnd) dateConditions.push({ [Op.lte]: dateEnd });
                config.where = {
                    ...config.where,
                    date: {
                        [Op.and]: dateConditions
                    }
                }
            }

            const { count, rows } = await Order.findAndCountAll(config);

            return res.status(200).json({ count, rows });
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getOrderById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse(req.params);
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async updateOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse(req.params);

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
            return res.sendStatus(500);
        }
    }
    async changeStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse(req.params);

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');

            const { status } = ChangeStatusSchema.parse(req.body);
            const oldStatus = order.getDataValue('status');
            await order.update({ status });

            const client = await Client.findByPk(order.getDataValue('clientId'));
            const user = await User.findByPk(client.getDataValue('userId'));
            if (oldStatus !== status && status === ORDER_STATUSES.COMPLETED) await sendOrderCompletedMail(user.getDataValue('email'), client.getDataValue('name'), order.getDataValue('reviewToken'));

            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async setRating(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetOrderSchema.parse(req.params);

            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            if (order.getDataValue('status') !== ORDER_STATUSES.COMPLETED) return res.status(409).json('Order not completed');

            const { rating } = SetRatingSchema.parse(req.body);
            if (order.getDataValue('rating')) return res.status(409).json('Rating already set');
            await order.update({ rating });
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async deleteOrder(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteOrderSchema.parse(req.params);
            const order = await Order.findByPk(id);
            if (!order) return res.status(404).json('No such order');
            await order.destroy();
            return res.status(200).json(order);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getMinAndMaxPrices(req: Request, res: Response): Promise<Response> {
        try {
            const prices = await Order.findAll({
                attributes: [
                    [sequelize.fn('min', sequelize.col('price')), 'min'],
                    [sequelize.fn('max', sequelize.col('price')), 'max']
                ]
            });

            return res.status(200).json(prices[0]);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
    async redirectToReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewToken: string = req.params.reviewToken;

            if (uuidValidate(reviewToken)) {
                const order = await Order.findOne({ where: { reviewToken } });
                if (!order) return res.redirect(`${process.env.CLIENT_LINK}/message/order-not-exist`);
                if (order.getDataValue('status') !== ORDER_STATUSES.COMPLETED) return res.redirect(`${process.env.CLIENT_LINK}/message/order-not-completed`);
                if (order.getDataValue('review')) return res.redirect(`${process.env.CLIENT_LINK}/message/order-already-reviewed`);

                return res.redirect(`${process.env.CLIENT_LINK}/order-review?${reviewToken}`);
            } else {
                return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
            }
        } catch (error) {
            return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
        }
    }
    async addReview(req: Request, res: Response): Promise<Response> {
        try {
            const reviewToken: string = req.params.reviewToken;

            if (uuidValidate(reviewToken)) {
                const order = await Order.findOne({ where: { reviewToken } });
                if (!order) return res.status(404).json('No such order');
                if (order.getDataValue('status') !== ORDER_STATUSES.COMPLETED) return res.status(409).json('Order not completed yet');
                if (order.getDataValue('review')) return res.status(409).json('Review already exist');

                const { rating, review } = addReviewSchema.parse(req.body);
                await order.update({ rating });
                if (review) await order.update({ review });

                return res.status(200).json(order);
            } else {
                return res.sendStatus(400);
            }
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async createReport(req: Request, res: Response): Promise<any> {
        try {
            const { cities, masters, clients, statuses, dateStart, dateEnd, sortedField, isDirectedASC, priceRange } = GetOrdersSchema.parse(req.query);

            let include = [
                { model: City, as: 'City', where: {}, attributes: [] },
                { model: Master, as: 'Master', where: {}, attributes: [] },
                { model: Client, as: 'Client', where: {}, attributes: [] }
            ];

            if (cities) {
                include = [...include, {
                    model: City, as: 'City',
                    where: { id: cities },
                    attributes: []
                }]
            }
            if (masters) {
                include = [...include, {
                    model: Master, as: 'Master',
                    where: { id: masters },
                    attributes: []
                }]
            }
            if (clients) {
                include = [...include, {
                    model: Client, as: 'Client',
                    where: { id: clients }, attributes: []
                }]
            }
            const config: FindOptions<Attributes<Model<OrderAttributes, OrderCreationAttributes>>> = {
                attributes: [
                    'id', 'watchSize', 'status', 'date', 'time', 'endTime', [sequelize.col('City.name'), 'city'], [sequelize.col('Client.name'), 'client'], [sequelize.col('Master.name'), 'master'], 'price', 'rating', 'review'
                ],
                include,
                order: [[sortedField || 'date', isDirectedASC ? 'ASC' : 'DESC']],
            }
            if (statuses) {
                config.where = { ...config.where, status: statuses }
            }
            if (priceRange) {
                config.where = { ...config.where, price: { [Op.between]: [priceRange[0], priceRange[1]] } }
            }
            if (dateStart || dateEnd) {
                const dateConditions = [];
                if (dateStart) dateConditions.push({ [Op.gte]: dateStart });
                if (dateEnd) dateConditions.push({ [Op.lte]: dateEnd });
                config.where = { ...config.where, date: { [Op.and]: dateConditions } }
            }

            const orders = await Order.findAll(config);

            const report = await createOrderReport(orders.map(order => order.toJSON()));

            return res.status(200).send(report);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
