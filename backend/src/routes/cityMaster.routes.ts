import { Router } from 'express';
import CityMasterController from '../controllers/cityMaster.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const cityMasterController: any = new CityMasterController();

router.post('/citymaster', authJWT, cityMasterController.addCityMaster);
router.get('/citymaster', cityMasterController.getCityMasters);
router.get('/citymaster/:id', cityMasterController.getCityMasterById);
router.put('/citymaster/:id', authJWT, cityMasterController.updateCityMaster);
router.delete('/citymaster/:id', authJWT, cityMasterController.deleteCityMaster);

export default router;
