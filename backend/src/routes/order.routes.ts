import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const orderController: any = new OrderController();

router.post('/order/client', orderController.addOrderClient);

router.post('/order', authJWT, orderController.addOrder);
router.post('/order/status', authJWT, orderController.changeStatus);
router.get('/order', authJWT, orderController.getOrders);
router.get('/order/:id', authJWT, orderController.getOrderById);
router.put('/order', authJWT, orderController.updateOrder);
router.delete('/order/:id', authJWT, orderController.deleteOrder);

export default router;
