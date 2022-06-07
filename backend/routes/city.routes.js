const Router = require('express');
const CityController = require('../controllers/city.controller');

const router = new Router();

router.post('/city', CityController.addCity);
router.get('/city', CityController.getCities);
router.get('/city/:id', CityController.getCityById);
router.put('/city', CityController.updateCity);
router.delete('/city/:id', CityController.deleteCity);

module.exports = router;