import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';

const router: Router = Router();
const paymentController: PaymentController = new PaymentController();

router.post('/accept-payment', paymentController.acceptPayment);

export default router;
