const Router = require('express');
const MasterController = require('../controllers/master.controller');

const router = new Router();

router.post('/master', MasterController.addMaster);
router.get('/master', MasterController.getMasters);
router.get('/master/:id', MasterController.getMasterById);
router.put('/master', MasterController.updateMaster);
router.delete('/master/:id', MasterController.deleteMaster);

module.exports = router;