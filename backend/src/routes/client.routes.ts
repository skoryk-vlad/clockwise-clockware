import { Router } from 'express';
import ClientController from '../controllers/client.controller';
import { checkOnlyAdmin } from './auth.routes';

const router: Router = Router();
const clientController: any = new ClientController();

router.post('/client', clientController.addClient);
router.get('/client', checkOnlyAdmin, clientController.getClients);
router.get('/client/:id', clientController.getClientById);
router.get('/client/email/:email', clientController.checkClientByEmail);
router.put('/client/:id', checkOnlyAdmin, clientController.updateClient);
router.delete('/client/:id', checkOnlyAdmin, clientController.deleteClient);
router.post('/client/reset/:id', clientController.resetPassword);

export default router;
