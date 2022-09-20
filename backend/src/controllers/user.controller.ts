import { sequelize } from './../sequelize';
import { sendConfirmationUserMail } from './../mailer';
import { Master } from './../models/master.model';
import { GetUserSchema } from './../validationSchemas/user.schema';
import { generatePassword, encryptPassword } from '../password';
import { sendResetedPasswordMail } from '../mailer';
import { ROLES, User } from '../models/user.model';
import { Client } from '../models/client.model';
import { Request, Response } from 'express';

export default class UserController {
    async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = GetUserSchema.parse({ email: req.params.email });
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json('No such user');

            const password = generatePassword();
            const hash = encryptPassword(password);
            user.update({ password: hash });

            let name = '';
            if (user.getDataValue('role') === ROLES.CLIENT) {
                const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                name = client.getDataValue('name');
            } else if (user.getDataValue('role') === ROLES.MASTER) {
                const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                name = master.getDataValue('name');
            }

            await sendResetedPasswordMail(user.getDataValue('email'), password, name);
            return res.status(200).json(user);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async createPassword(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = GetUserSchema.parse({ email: req.params.email });
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json('No such user');
            if (user.getDataValue('password')) return res.status(404).json('User already has password');

            const password = generatePassword();
            const hash = encryptPassword(password);
            user.update({ password: hash });

            let name = '';
            if (user.getDataValue('role') === ROLES.CLIENT) {
                const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                name = client.getDataValue('name');
            } else if (user.getDataValue('role') === ROLES.MASTER) {
                const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                name = master.getDataValue('name');
            }

            await sendConfirmationUserMail(user.getDataValue('email'), password, user.getDataValue('confirmationToken'), name);
            return res.status(200).json(user);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async checkUserByEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { email } = GetUserSchema.parse({ email: req.params.email });
            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(200).json(null);

            if (user.getDataValue('role') === ROLES.CLIENT) {
                const client = await Client.findOne({
                    where: {
                        userId: user.getDataValue('id')
                    },
                    attributes: ['id', 'name', [sequelize.col('User.email'), 'email'], [sequelize.col('User.role'), 'role']],
                    include: [{
                        model: User,
                        attributes: []
                    }]
                });
                return res.status(200).json(client);
            } else if (user.getDataValue('role') === ROLES.MASTER) {
                const master = await Master.findOne({
                    where: {
                        userId: user.getDataValue('id')
                    },
                    attributes: ['id', 'name', [sequelize.col('User.email'), 'email'], [sequelize.col('User.role'), 'role']],
                    include: [{
                        model: User,
                        attributes: []
                    }]
                });
                return res.status(200).json(master);
            }
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
