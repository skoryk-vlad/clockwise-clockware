import { JWTUserPayload } from './../types';
import { ROLES } from './../models/user.model';
import { Router, Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/auth.controller';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const authController: AuthController = new AuthController();

export const isJwtNotExpired = (req: Request, res: Response, next: NextFunction): Response => {
    try {
        const authHeader: string = req.headers.authorization;
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_TOKEN_KEY) as JWTUserPayload;

        next();
    } catch (error) {
        return res.status(401).json('Token is invalid or expired');
    }
};
export const hasRoles = (roles: ROLES[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader: string = req.headers.authorization;
        const token: string = authHeader.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_TOKEN_KEY) as JWTUserPayload;
        if (roles.includes(payload.role)) return next();
        
        return res.status(403).json('Forbidden');
    }
};

router.post('/auth', authController.login);
router.post('/auth/service', authController.loginByService);

export default router;
