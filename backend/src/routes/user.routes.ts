import { ROLES } from '../models/user.model';
import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const userController: UserController = new UserController();

router.post('/user/password/reset/:email', isJwtNotExpired, hasRoles([ROLES.ADMIN]), userController.resetPassword);
router.post('/user/password/create/:email', userController.createPassword);
router.get('/user/email/:email', userController.checkUserByEmail);

export default router;
