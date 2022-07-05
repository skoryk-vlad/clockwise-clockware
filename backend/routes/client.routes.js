const Router = require('express');
const ClientController = require('../controllers/client.controller');
const authModule = require('./auth.routes');

const router = new Router();

router.post('/client', authModule.authJWT, ClientController.addClient);
router.get('/client', authModule.authJWT, ClientController.getClients);
router.get('/client/:id', authModule.authJWT, ClientController.getClientById);
router.put('/client', authModule.authJWT, ClientController.updateClient);
router.delete('/client/:id', authModule.authJWT, ClientController.deleteClient);

module.exports = router;