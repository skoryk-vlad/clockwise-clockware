import { Master, MASTER_STATUSES } from './../models/master.model';
import { Client, CLIENT_STATUSES } from './../models/client.model';
import { ROLES, User } from './../models/user.model';
import { AuthInfo } from './../types';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const { email, password }: AuthInfo = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json('User with this email address is not registered');
        
        if (!user.getDataValue('password')) return res.status(403).json({ name: `User don't have a password`, role: user.getDataValue('role') });

        if (bcrypt.compareSync(password, user.getDataValue('password'))) {
            let id = 1;
            if (user.getDataValue('role') === ROLES.CLIENT) {
                const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                if (client.getDataValue('status') === CLIENT_STATUSES.NOT_CONFIRMED) return res.status(403).json('Email not verified');
                id = client.getDataValue('id');
            }
            if (user.getDataValue('role') === ROLES.MASTER) {
                const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                if (master.getDataValue('status') === MASTER_STATUSES.NOT_CONFIRMED) return res.status(403).json('Email not verified');
                if (master.getDataValue('status') !== MASTER_STATUSES.APPROVED) return res.status(403).json('Master not yet approved');
                id = master.getDataValue('id');
            }

            return res.status(200).json({
                token: jwt.sign({ role: user.getDataValue('role'), id }, process.env.JWT_TOKEN_KEY, { expiresIn: '3h' })
            });
        }

        return res.status(401).json('Email or password incorrect')
    }
}
