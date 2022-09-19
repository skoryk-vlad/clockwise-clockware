import { Router } from 'express';
import CityController from '../controllers/city.controller';
import { checkOnlyAdmin } from './auth.routes';

const router: Router = Router();
const cityController: any = new CityController();

router.post('/city', checkOnlyAdmin, cityController.addCity);
router.get('/city', cityController.getCities);
router.get('/city/:id', cityController.getCityById);
router.put('/city/:id', checkOnlyAdmin, cityController.updateCity);
router.delete('/city/:id', checkOnlyAdmin, cityController.deleteCity);

export default router;
