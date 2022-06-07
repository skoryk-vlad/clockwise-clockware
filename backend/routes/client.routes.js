const Router = require('express');
const ClientController = require('../controllers/client.controller');

const router = new Router();

router.post('/client', ClientController.addClient);
router.get('/client', ClientController.getClients);
router.get('/client/:id', ClientController.getClientById);
// router.get('/client/:email', ClientController.getClientByEmail);
router.put('/client', ClientController.updateClient);
router.delete('/client/:id', ClientController.deleteClient);

module.exports = router;