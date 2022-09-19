import { JWTRolePayload } from './../types';
import { ROLES } from './../models/user.model';
import { Router, Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/auth.controller';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const authController: any = new AuthController();

const jwtRolePayload = (token: string): JWTRolePayload => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

export const checkJWTExpired = (req: Request, res: Response, next: NextFunction): Response => {
    const authHeader: string = req.headers.authorization;

    if (authHeader) {
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err) => {
            if (err) return res.status(401).json('Token expired');

            next();
        });
    } else {
        return res.sendStatus(401);
    }
};
export const checkOnlyAdmin = (req: Request, res: Response, next: NextFunction): Response => {
    const authHeader: string = req.headers.authorization;

    if (authHeader) {
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err) => {
            if (err) return res.status(401).json('Token expired');

            const jwtPayload = jwtRolePayload(authHeader);
            if(jwtPayload.role !== ROLES.ADMIN) return res.status(403).json('Forbidden');

            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

router.post('/auth', authController.login);

export default router;
