const db = require('../db');
const validate = require('../validate.js');

class ClientController {
    async addClient(req, res) {
        const error = await validate(req.body, ['name', 'email']);

        if(error) {
            res.status(400).json(error);
            return;
        }
        
        const {name, email} = req.body;
        const client = await db.query(`SELECT * FROM addClient($1, $2)`, [name, email]);
        res.status(201).json(client.rows[0]);
    }
    async getClients(req, res) {
        const clients = await db.query('SELECT * FROM client ORDER BY id');
        res.status(200).json(clients.rows);
    }
    async getClientById(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const client = await db.query('SELECT * FROM client WHERE id=$1', [id]);
        res.status(200).json(client.rows[0]);
    }
    async updateClient(req, res) {
        const error = await validate(req.body, ['id', 'name', 'email']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {id, name, email} = req.body;
        const client = await db.query('SELECT * FROM updateClient($1, $2, $3);', [id, name, email]);
        res.status(200).json(client.rows[0]);
    }
    async deleteClient(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const clientOrders = await db.query('SELECT * FROM orders WHERE client_id=$1', [id]);
        if(clientOrders.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'orders' that depend on this client");
            return;
        }

        const client = await db.query('DELETE FROM client WHERE id=$1 RETURNING *', [id]);
        res.status(200).json(client.rows[0]);
    }
}

module.exports = new ClientController();
