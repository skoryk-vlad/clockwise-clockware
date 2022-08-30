import { AuthInfo } from './../types';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default class AuthController {
    async login(req: Request, res: Response): Promise<Response> {
        const { login, password }: AuthInfo = req.body;
        const authInfo: AuthInfo = JSON.parse(process.env.AUTH);
        if (login === authInfo.login && password === authInfo.password) {
            return res.status(200).json({
                token: jwt.sign({ user: 'admin' }, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'})
            })
        }
    
        return res.status(401).json({ message: 'Username or password incorrect' })
    }
    async check(req: Request, res: Response): Promise<Response> {
        return res.status(200).json({auth: true});
    }
}
