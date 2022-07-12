const Router = require('express');
const ConfirmationController = require('../controllers/confirmation.controller');

const router = new Router();

router.get('/confirmation/:conftoken', ConfirmationController.confirmOrder);

module.exports = router;