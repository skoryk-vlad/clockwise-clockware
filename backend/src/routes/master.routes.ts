import { Router } from 'express';
import MasterController from '../controllers/master.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const masterController: any = new MasterController();

router.post('/master', masterController.addMaster);
router.get('/master', masterController.getMasters);
router.get('/master/:id', masterController.getMasterById);
router.get('/freemasters', masterController.getFreeMasters);
router.put('/master/:id', authJWT, masterController.updateMaster);
router.delete('/master/:id', authJWT, masterController.deleteMaster);
router.post('/master/reset/:id', authJWT, masterController.resetPassword);

export default router;
