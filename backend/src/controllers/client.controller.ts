import { Master } from './../models/master.model';
import { Order } from './../models/order.model';
import { generatePassword, encryptPassword } from './../password';
import { sendConfirmationUserMail, sendUserLoginInfoMail } from './../mailer';
import { sequelize } from './../sequelize';
import { Op } from 'sequelize';
import { ROLES, User } from './../models/user.model';
import { AddClientSchema, DeleteClientSchema, GetClientSchema, UpdateClientSchema, AddClientByAdminSchema } from './../validationSchemas/client.schema';
import { Client, CLIENT_STATUSES } from './../models/client.model';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export default class ClientController {
    async addClient(req: Request, res: Response): Promise<Response> {
        const addClientTransaction = await sequelize.transaction();
        try {
            const { name, email, password, status } = AddClientSchema.parse(req.body);

            const existUser = await User.findOne({ where: { email } });
            if (existUser) return res.status(409).json('User with this email exist');

            const hash = encryptPassword(password);
            const confirmationToken = uuidv4();

            const user = await User.create({
                email, password: hash, role: ROLES.CLIENT, confirmationToken
            }, {
                transaction: addClientTransaction
            });

            const client = await Client.create({ name, userId: user.getDataValue('id'), status }, {
                transaction: addClientTransaction
            });

            await sendConfirmationUserMail(email, password, confirmationToken, name);
            await addClientTransaction.commit();
            return res.status(201).json(client);
        } catch (error) {
            await addClientTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async addClientByAdmin(req: Request, res: Response): Promise<Response> {
        const addClientTransaction = await sequelize.transaction();
        try {
            const { name, email, status } = AddClientByAdminSchema.parse(req.body);

            const existUser = await User.findOne({ where: { email } });
            if (existUser) return res.status(409).json('User with this email exist');

            const password = generatePassword();
            const hash = encryptPassword(password);
            const confirmationToken = uuidv4();

            const user = await User.create({
                email, password: hash, role: ROLES.CLIENT, confirmationToken
            }, {
                transaction: addClientTransaction
            });

            const client = await Client.create({ name, userId: user.getDataValue('id'), status }, {
                transaction: addClientTransaction
            });

            if (status === CLIENT_STATUSES.NOT_CONFIRMED) {
                await sendConfirmationUserMail(email, password, confirmationToken, name);
            } else if (status === CLIENT_STATUSES.CONFIRMED) {
                await sendUserLoginInfoMail(email, password, name);
            }
            await addClientTransaction.commit();
            return res.status(201).json(client);
        } catch (error) {
            await addClientTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getClients(req: Request, res: Response): Promise<Response> {
        try {
            const clients = await Client.findAll({
                attributes: { include: [[sequelize.col('User.email'), 'email']] },
                include: {
                    model: User,
                    attributes: []
                },
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(clients);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
    async getClientById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetClientSchema.parse({ id: +req.params.id });
            const client = await Client.findByPk(id, {
                attributes: { include: [[sequelize.col('User.email'), 'email']] },
                include: {
                    model: User,
                    attributes: []
                }
            });
            if (!client) return res.status(404).json('No such client');
            return res.status(200).json(client);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async getClientOrdersById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetClientSchema.parse({ id: +req.params.id });

            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');

            const orders = await Order.findAll({
                where: {
                    clientId: id
                },
                attributes: ['id', [sequelize.col('Master.name'), 'master'], 'watchSize', 'date', 'time', 'endTime', 'price', 'status', 'rating'],
                include: [{
                    model: Master, attributes: []
                }],
                order: ['id']
            });
            return res.status(200).json(orders);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async updateClient(req: Request, res: Response): Promise<Response> {
        const updateClientTransaction = await sequelize.transaction();
        try {
            const { id } = GetClientSchema.parse({ id: +req.params.id });

            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');

            const { name, email, status } = UpdateClientSchema.parse(req.body);

            const existUser = await User.findOne({ where: { email, id: { [Op.ne]: client.getDataValue('userId') } } });
            if (existUser) return res.status(409).json('User with this email exist');

            await User.update({ email }, { where: { id: client.getDataValue('userId') }, transaction: updateClientTransaction });

            await client.update({ name, status }, { transaction: updateClientTransaction });

            await updateClientTransaction.commit();
            return res.status(200).json(client);
        } catch (error) {
            await updateClientTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async deleteClient(req: Request, res: Response): Promise<Response> {
        const deleteClientTransaction = await sequelize.transaction();
        try {
            const { id } = DeleteClientSchema.parse({ id: +req.params.id });
            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');

            const user = await User.findByPk(client.getDataValue('userId'));

            await client.destroy({ transaction: deleteClientTransaction });
            await user.destroy({ transaction: deleteClientTransaction });

            await deleteClientTransaction.commit();
            return res.status(200).json(client);
        } catch (error) {
            await deleteClientTransaction.rollback();
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
