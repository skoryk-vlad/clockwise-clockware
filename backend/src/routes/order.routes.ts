import { ROLES } from './../models/user.model';
import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const orderController: OrderController = new OrderController();

import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/order', upload.array('images', 5), orderController.addOrder);
router.post('/order/status/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN, ROLES.MASTER]), orderController.changeStatus);
router.post('/order/rating/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN, ROLES.CLIENT]), orderController.setRating);
router.get('/order', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getOrders);
router.get('/order/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getOrderById);
router.put('/order/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.updateOrder);
router.delete('/order/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.deleteOrder);
router.get('/order-min-max-prices', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getMinAndMaxPrices);
router.get('/order-review/:reviewToken', orderController.redirectToReview);
router.post('/add-order-review/:reviewToken', orderController.addReview);
router.get('/order-report', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.createReport);
router.get('/order-images/:id', isJwtNotExpired, hasRoles([ROLES.MASTER]), orderController.getOrderImages);
router.get('/statistics/order-city', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getOrderCityStatistics);
router.get('/statistics/order-masters', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getOrderMastersStatistics);
router.get('/statistics/order-dates', isJwtNotExpired, hasRoles([ROLES.ADMIN]), orderController.getOrderDatesStatistics);

export default router;
