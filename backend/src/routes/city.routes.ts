import { Router } from 'express';
import CityController from '../controllers/city.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const cityController: any = new CityController();

router.post('/city', authJWT, cityController.addCity);
router.get('/city', cityController.getCities);
router.get('/city/:id', cityController.getCityById);
router.put('/city', authJWT, cityController.updateCity);
router.delete('/city/:id', authJWT, cityController.deleteCity);

export default router;
