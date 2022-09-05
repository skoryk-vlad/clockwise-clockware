import { Router } from 'express';
import ClientController from '../controllers/client.controller';
import { authJWT } from './auth.routes';

const router: Router = Router();
const clientController: any = new ClientController();

router.post('/client', authJWT, clientController.addClient);
router.get('/client', authJWT, clientController.getClients);
router.get('/client/:id', authJWT, clientController.getClientById);
router.put('/client/:id', authJWT, clientController.updateClient);
router.delete('/client/:id', authJWT, clientController.deleteClient);

export default router;
