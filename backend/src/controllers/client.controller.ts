import { Client } from './../types';
import { Request, Response } from 'express';
import db from './../db';
import { validate } from './../validate';

export default class ClientController {
    async addClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'email']);

        if (error) return res.status(400).json(error);
        
        const { name, email }: Client = req.body;
        const client: Client[] = (await db.query(`SELECT * FROM addClient($1, $2)`, [name, email])).rows;
        return res.status(201).json(client[0]);
    }
    async getClients(req: Request, res: Response): Promise<Response> {
        const clients: Client[] = (await db.query('SELECT * FROM client ORDER BY id')).rows;
        return res.status(200).json(clients);
    }
    async getClientById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);
        const client: Client[] = (await db.query('SELECT * FROM client WHERE id=$1', [id])).rows;
        return res.status(200).json(client[0]);
    }
    async updateClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name', 'email']);

        if (error) return res.status(400).json(error);

        const {id, name, email}: Client = req.body;
        const client: Client[] = (await db.query('SELECT * FROM updateClient($1, $2, $3);', [id, name, email])).rows;
        return res.status(200).json(client[0]);
    }
    async deleteClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);

        if (error) return res.status(400).json(error);

        const id: number = Number(req.params.id);

        const clientOrders: number[] = (await db.query('SELECT 1 FROM orders WHERE client_id=$1', [id])).rows;
        if(clientOrders.length !== 0) return res.status(400).json("There are rows in the table 'orders' that depend on this client");

        const client: Client[] = (await db.query('DELETE FROM client WHERE id=$1 RETURNING *', [id])).rows;
        return res.status(200).json(client[0]);
    }
}
