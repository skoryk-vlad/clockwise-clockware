import { Router } from 'express';
import MasterController from '../controllers/master.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const masterController: any = new MasterController();

router.post('/master', authJWT, masterController.addMaster);
router.get('/master', masterController.getMasters);
router.get('/master/:id', masterController.getMasterById);
router.get('/availmaster', masterController.getAvailableMasters);
router.put('/master', authJWT, masterController.updateMaster);
router.delete('/master/:id', authJWT, masterController.deleteMaster);

export default router;
