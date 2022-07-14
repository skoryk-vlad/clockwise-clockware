const Router = require('express');
const CityMasterController = require('../controllers/city-master.controller');
const authModule = require('./auth.routes');

const router = new Router();

router.post('/city-master', authModule.authJWT, CityMasterController.addConnection);
router.get('/city-master', CityMasterController.getConnections);
router.get('/city-master/ids', CityMasterController.getConnectionsId);
router.put('/city-master', authModule.authJWT, CityMasterController.updateConnection);
router.delete('/city-master/:id', authModule.authJWT, CityMasterController.deleteConnection);

module.exports = router;