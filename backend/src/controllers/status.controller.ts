import { Status } from './../types';
import { Request, Response } from 'express';
import db from '../db';

export default class StatusController {
    async getStatuses(req: Request, res: Response): Promise<Response> {
        const statuses: Status[] = (await db.query('SELECT * FROM status')).rows;
        return res.status(200).json(statuses);
    }
}
