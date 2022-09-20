import { ROLES } from './../models/user.model';
import { Router } from 'express';
import ClientController from '../controllers/client.controller';
import { isJwtNotExpired, hasRoles } from './auth.routes';

const router: Router = Router();
const clientController: ClientController = new ClientController();

router.post('/client/user', clientController.addClient);
router.post('/client/admin', isJwtNotExpired, hasRoles([ROLES.ADMIN]), clientController.addClientByAdmin);
router.get('/client', isJwtNotExpired, hasRoles([ROLES.ADMIN]), clientController.getClients);
router.get('/client/:id', clientController.getClientById);
router.get('/client/:id/orders', isJwtNotExpired, hasRoles([ROLES.ADMIN, ROLES.CLIENT]), clientController.getClientOrdersById);
router.put('/client/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), clientController.updateClient);
router.delete('/client/:id', isJwtNotExpired, hasRoles([ROLES.ADMIN]), clientController.deleteClient);

export default router;
