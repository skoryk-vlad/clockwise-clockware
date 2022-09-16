import { Router } from 'express';
import ClientController from '../controllers/client.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const clientController: any = new ClientController();

router.post('/client', clientController.addClient);
router.get('/client', authJWT, clientController.getClients);
router.get('/client/:id', authJWT, clientController.getClientById);
router.get('/client/email/:email', authJWT, clientController.checkClientByEmail);
router.put('/client/:id', authJWT, clientController.updateClient);
router.delete('/client/:id', authJWT, clientController.deleteClient);
router.post('/client/reset/:id', authJWT, clientController.resetPassword);

export default router;
