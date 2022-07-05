const db = require('../db');

class ClientController {
    async addClient(req, res) {
        const {name, email} = req.body;
        const client = await db.query('SELECT * FROM client WHERE email=$1', [email]);
        if(client.rows.length === 0) {
            const newClient = await db.query(`INSERT INTO client (name, email) values ($1, $2) RETURNING * `, [name, email]);
            res.json(newClient.rows[0]);
        } else {
            res.json(client.rows[0]);
        }
    }
    async getClients(req, res) {
        const clients = await db.query('SELECT * FROM client');
        res.json(clients.rows);
    }
    async getClientById(req, res) {
        const id = req.params.id;
        const client = await db.query('SELECT * FROM client WHERE id=$1', [id]);
        res.json(client.rows[0]);
    }
    async updateClient(req, res) {
        const {id, name, email} = req.body;
        const client = await db.query('UPDATE client set name = $1, email = $2 where id = $3 RETURNING *', [name, email, id]);
        res.json(client.rows[0]);
    }
    async deleteClient(req, res) {
        const id = req.params.id;
        const client = await db.query('DELETE FROM client WHERE id=$1 RETURNING *', [id]);
        res.json(client.rows[0]);
    }
}

module.exports = new ClientController();
