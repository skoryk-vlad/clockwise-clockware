const Router = require('express');
const MasterController = require('../controllers/master.controller');
const authModule = require('./auth.routes');

const router = new Router();

router.post('/master', authModule.authJWT, MasterController.addMaster);
router.get('/master', MasterController.getMasters);
router.get('/master/:id', MasterController.getMasterById);
router.get('/availmaster', MasterController.getAvailableMasters);
router.put('/master', authModule.authJWT, MasterController.updateMaster);
router.delete('/master/:id', authModule.authJWT, MasterController.deleteMaster);

module.exports = router;