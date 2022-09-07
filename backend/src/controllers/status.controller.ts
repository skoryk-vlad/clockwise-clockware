import { Status } from './../models/status.model';
import { Request, Response } from 'express';

export default class StatusController {
    async getStatuses(req: Request, res: Response): Promise<Response> {
        try {
            const statuses = await Status.findAll();
            return res.status(200).json(statuses);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}
