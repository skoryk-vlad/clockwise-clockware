import { ROLES } from './../models/user.model';
import { Router } from 'express';
import MasterController from '../controllers/master.controller';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const masterController: MasterController = new MasterController();

router.post('/master/user', masterController.addMaster);
router.post('/master/service', masterController.addMasterByService);
router.post('/master/admin', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.addMasterByAdmin);
router.get('/master', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.getMasters);
router.get('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.getMasterById);
router.get('/master/:id/orders', isJwtNotExpired, hasRoles([ROLES.ADMIN, ROLES.MASTER]), masterController.getMasterOrdersById);
router.get('/freemasters', masterController.getFreeMasters);
router.put('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.updateMaster);
router.delete('/master/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.deleteMaster);
router.get('/master-reviews/:id', masterController.getMasterReviews);
router.get('/statistics/master', isJwtNotExpired, hasRoles([ROLES.ADMIN]), masterController.getMastersStatistics);

export default router;
