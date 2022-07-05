const Router = require('express');
const OrderController = require('../controllers/order.controller');
const authModule = require('./auth.routes');

const router = new Router();

router.post('/order/client', OrderController.addOrderClient);

router.post('/order', authModule.authJWT, OrderController.addOrder);
router.post('/order/complete', authModule.authJWT, OrderController.completeOrder);
router.get('/order', authModule.authJWT, OrderController.getOrders);
router.get('/order/:id', authModule.authJWT, OrderController.getOrderById);
router.put('/order', authModule.authJWT, OrderController.updateOrder);
router.delete('/order/:id', authModule.authJWT, OrderController.deleteOrder);

module.exports = router;