import { Router } from 'express';
import MasterController from '../controllers/master.controller';
import { checkOnlyAdmin } from './auth.routes';

const router: Router = Router();
const masterController: any = new MasterController();

router.post('/master', masterController.addMaster);
router.get('/master', masterController.getMasters);
router.get('/master/:id', masterController.getMasterById);
router.get('/client/email/:email', masterController.checkMasterByEmail);
router.get('/freemasters', masterController.getFreeMasters);
router.put('/master/:id', checkOnlyAdmin, masterController.updateMaster);
router.delete('/master/:id', checkOnlyAdmin, masterController.deleteMaster);
router.post('/master/reset/:id', masterController.resetPassword);

export default router;
