import { Router } from 'express';
import StatusController from '../controllers/status.controller';

const router: Router = Router();
const statusController: any = new StatusController();

router.get('/status', statusController.getStatuses);

export default router;
