import { Router, Request, Response, NextFunction } from 'express';
import AuthController from '../controllers/auth.controller';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const authController: any = new AuthController();

const authJWT = (req: Request, res: Response, next: NextFunction): Response => {
    const authHeader: string = req.headers.authorization;

    if (authHeader) {
        const token: string = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err) => {
            if (err) return res.status(401).json({auth: false});

            next();
        });
    } else {
        return res.sendStatus(401);
    }
};

router.post('/auth', authController.login);
router.get('/admin', authJWT, authController.check);

export default router;
export { authJWT };
