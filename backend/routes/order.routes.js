const Router = require('express');
const OrderController = require('../controllers/order.controller');

const router = new Router();

router.post('/order', OrderController.addOrder);
router.get('/order', OrderController.getOrders);
router.get('/order/:id', OrderController.getOrderById);
router.put('/order', OrderController.updateOrder);
router.delete('/order/:id', OrderController.deleteOrder);

module.exports = router;