import { ClientAttributes, Client } from './../models/client.model';
import { Request, Response } from 'express';
import { validate } from './../validate';

export default class ClientController {
    async addClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['name', 'email']);
        if (error) return res.status(400).json(error);

        const { name, email }: ClientAttributes = req.body;
        try {
            const client = await Client.upsert({ name, email }, {
                conflictFields: ['email']
            });
            return res.status(201).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getClients(req: Request, res: Response): Promise<Response> {
        try {
            const clients = await Client.findAll({
                order: [
                    ['id', 'ASC']
                ]
            });
            return res.status(200).json(clients);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async getClientById(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const client = await Client.findByPk(id);
            return res.status(200).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async updateClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.body, ['id', 'name', 'email']);
        if (error) return res.status(400).json(error);

        const { id, name, email }: ClientAttributes = req.body;
        try {
            const [client, created] = await Client.upsert({
                id,
                name,
                email
            });
            return res.status(200).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async deleteClient(req: Request, res: Response): Promise<Response> {
        const error: string = await validate(req.params, ['id']);
        if (error) return res.status(400).json(error);

        const id = +req.params.id;
        try {
            const client = await Client.findByPk(id);
            await client.destroy();
            return res.status(200).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
