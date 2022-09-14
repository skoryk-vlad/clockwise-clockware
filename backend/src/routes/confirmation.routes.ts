import { Router } from 'express';
import ConfirmationController from '../controllers/confirmation.controller';

const router: Router = Router();
const confirmationController: any = new ConfirmationController();

router.get('/confirmation/:uuid', confirmationController.confirmOrder);

export default router;