import { AddClientSchema, DeleteClientSchema, GetClientSchema, UpdateClientSchema } from './../validationSchemas/client.schema';
import { Client } from './../models/client.model';
import { Request, Response } from 'express';

export default class ClientController {
    async addClient(req: Request, res: Response): Promise<Response> {
        try {
            const { name, email } = AddClientSchema.parse(req.body);
            const client = await Client.create({ name, email });
            return res.status(201).json(client);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
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
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    async getClientById(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetClientSchema.parse({ id: +req.params.id });
            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');
            return res.status(200).json(client);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async updateClient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = GetClientSchema.parse({ id: +req.params.id });

            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');

            const { name, email } = UpdateClientSchema.parse(req.body);

            client.update({ name, email })
            return res.status(200).json(client);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
    async deleteClient(req: Request, res: Response): Promise<Response> {
        try {
            const { id } = DeleteClientSchema.parse({ id: +req.params.id });
            const client = await Client.findByPk(id);
            if (!client) return res.status(404).json('No such client');
            await client.destroy();
            return res.status(200).json(client);
        } catch (error) {
            if (error?.name === "ZodError") return res.status(400).json(error.issues);
            return res.status(500).json(error);
        }
    }
}
