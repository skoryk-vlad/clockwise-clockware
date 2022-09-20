import { Router } from 'express';
import CityController from '../controllers/city.controller';
import { ROLES } from '../models/user.model';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const cityController: CityController = new CityController();

router.post('/city', isJwtNotExpired, hasRoles([ROLES.ADMIN]), cityController.addCity);
router.get('/city', cityController.getCities);
router.get('/city/:id', cityController.getCityById);
router.put('/city/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), cityController.updateCity);
router.delete('/city/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), cityController.deleteCity);

export default router;
