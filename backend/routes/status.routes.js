const Router = require('express');
const StatusController = require('../controllers/status.controller');

const router = new Router();

router.get('/status', StatusController.getStatuses);

module.exports = router;