import { Router } from 'express';
import PaymentController from '../controllers/payment.controller';

const router: Router = Router();
const paymentController: PaymentController = new PaymentController();

router.post('/pay', paymentController.createPayment);
router.get('/pay/success', paymentController.successPayment);
router.get('/pay/cancel', paymentController.cancelPayment);

export default router;
