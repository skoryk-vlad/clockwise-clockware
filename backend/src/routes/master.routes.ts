import { ROLES } from './../models/user.model';
import { Router } from 'express';
import MasterController from '../controllers/master.controller';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const masterController: MasterController = new MasterController();

router.post('/master/user', masterController.addMaster);
router.post('/master/admin', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.addMasterByAdmin);
router.get('/master', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.getMasters);
router.get('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.getMasterById);
router.get('/master/:id/orders', isJwtNotExpired, hasRoles([ROLES.ADMIN, ROLES.MASTER]), masterController.getMasterOrdersById);
router.get('/freemasters', masterController.getFreeMasters);
router.put('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.updateMaster);
router.delete('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.deleteMaster);

export default router;
