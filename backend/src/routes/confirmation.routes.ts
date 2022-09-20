import { Router } from 'express';
import ConfirmationController from '../controllers/confirmation.controller';

const router: Router = Router();
const confirmationController: ConfirmationController = new ConfirmationController();

router.get('/confirm/order/:confirmationToken', confirmationController.confirmOrder);
router.get('/confirm/user/:confirmationToken', confirmationController.confirmUser);

export default router;