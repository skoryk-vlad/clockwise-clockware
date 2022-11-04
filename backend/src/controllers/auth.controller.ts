import { UserInfo } from './../types';
import { LoginSchema, LoginByServiceSchema } from './../validationSchemas/auth.schema';
import { Master, MASTER_STATUSES } from './../models/master.model';
import { Client, CLIENT_STATUSES } from './../models/client.model';
import { ROLES, User } from './../models/user.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { OAuth2Client } from "google-auth-library";
import axios from 'axios';
import { AUTH_SERVICES } from '../types';

export const googleClient = new OAuth2Client({
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
});

export const getUserInfo = async (token: string, service: string): Promise<UserInfo> => {
    switch (service) {
        case AUTH_SERVICES.GOOGLE:
            const ticket = await googleClient.verifyIdToken({
                idToken: token,
                audience: `${process.env.GOOGLE_CLIENT_ID}`
            });
            const payload = ticket.getPayload();
            return { email: payload?.email, name: payload?.name };
        case AUTH_SERVICES.FACEBOOK:
            const { data } = await axios.get(`https://graph.facebook.com/v15.0/me?access_token=${token}&fields=email,name`);
            return data;
        default:
            throw new Error('Service not found');
    }
};

export default class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = LoginSchema.parse(req.body);

            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json('Email or password is incorrect');

            if (!user.getDataValue('password')) return res.status(403).json(`User doesn't have a password`);

            if (bcrypt.compareSync(password, user.getDataValue('password'))) {
                let id = null;
                if (user.getDataValue('role') === ROLES.ADMIN) {
                    id = 1;
                } else if (user.getDataValue('role') === ROLES.CLIENT) {
                    const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                    if (client.getDataValue('status') === CLIENT_STATUSES.NOT_CONFIRMED) return res.status(403).json('Email is not verified');
                    id = client.getDataValue('id');
                } else if (user.getDataValue('role') === ROLES.MASTER) {
                    const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                    if (master.getDataValue('status') === MASTER_STATUSES.NOT_CONFIRMED) return res.status(403).json('Email is not verified');
                    if (master.getDataValue('status') !== MASTER_STATUSES.APPROVED) return res.status(403).json('Master is not yet approved');
                    id = master.getDataValue('id');
                }

                return res.status(200).json({
                    token: jwt.sign({ role: user.getDataValue('role'), id }, process.env.JWT_TOKEN_KEY, { expiresIn: '3h' })
                });
            }

            return res.status(401).json('Email or password is incorrect');
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
    async loginByService(req: Request, res: Response) {
        try {
            const { token, service } = LoginByServiceSchema.parse(req.body);

            const { email } = await getUserInfo(token, service);

            const user = await User.findOne({ where: { email } });
            if (!user) return res.status(404).json('Not found');

            let id = null;
            if (user.getDataValue('role') === ROLES.ADMIN) {
                id = 1;
            } else if (user.getDataValue('role') === ROLES.CLIENT) {
                const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                if (client.getDataValue('status') === CLIENT_STATUSES.NOT_CONFIRMED) await client.update({ status: CLIENT_STATUSES.CONFIRMED });
                id = client.getDataValue('id');
            } else if (user.getDataValue('role') === ROLES.MASTER) {
                const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                if (master.getDataValue('status') === MASTER_STATUSES.NOT_CONFIRMED) await master.update({ status: MASTER_STATUSES.CONFIRMED });
                if (master.getDataValue('status') !== MASTER_STATUSES.APPROVED) return res.status(403).json('Master is not yet approved');
                id = master.getDataValue('id');
            }

            return res.json({
                token: jwt.sign({ role: user.getDataValue('role'), id }, process.env.JWT_TOKEN_KEY, { expiresIn: '3h' })
            });
        } catch (error) {
            if (error.message === 'Service not found') return res.status(404).json(error.message);
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.sendStatus(500);
        }
    }
}
