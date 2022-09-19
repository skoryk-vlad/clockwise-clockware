import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { checkJWTExpired, checkOnlyAdmin } from './auth.routes';

const router: Router = Router();
const orderController: any = new OrderController();

router.post('/order', orderController.addOrder);
router.post('/order/status/:id', checkJWTExpired, orderController.changeStatus);
router.post('/order/rating/:id', checkJWTExpired, orderController.setRating);
router.get('/order', checkJWTExpired, orderController.getOrders);
router.get('/order/:id', checkJWTExpired, orderController.getOrderById);
router.put('/order/:id', checkOnlyAdmin, orderController.updateOrder);
router.delete('/order/:id', checkOnlyAdmin, orderController.deleteOrder);

export default router;
