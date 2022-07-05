const Router = require('express');
const CityController = require('../controllers/city.controller');
const authModule = require('./auth.routes');

const router = new Router();

router.post('/city', authModule.authJWT, CityController.addCity);
router.get('/city', CityController.getCities);
router.get('/city/:id', CityController.getCityById);
router.put('/city', authModule.authJWT, CityController.updateCity);
router.delete('/city/:id', authModule.authJWT, CityController.deleteCity);

module.exports = router;