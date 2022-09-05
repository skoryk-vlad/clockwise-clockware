import { ClientSchema } from './../validationSchemas/client.schema';
import { Client } from './../models/client.model';
import { Request, Response } from 'express';

export default class ClientController {
    async addClient(req: Request, res: Response): Promise<Response> {
        const optionalId = ClientSchema.partial({
            id: true,
        });
        try {
            const { name, email } = optionalId.parse(req.body);
            const client = await Client.create({ name, email });
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
        try {
            const id = ClientSchema.shape.id.parse(+req.params.id);
            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');
            return res.status(200).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
    async updateClient(req: Request, res: Response): Promise<Response> {
        try {
            const { id, name, email } = ClientSchema.parse(req.body);

            const existClient = await Client.findByPk(id);
            if (!existClient) return res.status(404).json('No such client');

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
        try {
            const id = ClientSchema.shape.id.parse(+req.params.id);
            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');
            await client.destroy();
            return res.status(200).json(client);
        } catch (e) {
            return res.status(500).json(e);
        }
    }
}
