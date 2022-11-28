import { Router } from 'express';
import MapController from '../controllers/map.controller';
import { ROLES } from '../models/user.model';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const mapController: MapController = new MapController();

router.post('/map/area', isJwtNotExpired, hasRoles([ROLES.ADMIN]), mapController.setAreas);
router.get('/map/area/:cityId', isJwtNotExpired, hasRoles([ROLES.ADMIN]), mapController.getAreas);
router.get('/map/point-in-area', mapController.checkPointInArea);

export default router;
