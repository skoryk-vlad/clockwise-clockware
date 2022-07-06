const db = require('../db');

const validate = (props, neededProps) => {
    let missing = [];
    neededProps.forEach(prop => {
        if (!props.hasOwnProperty(prop)) {
            missing.push(prop);
        }
    });
    if (missing.length !== 0) {
        return `Missing propert${missing.length === 1 ? 'y' : 'ies'} '${missing.join(', ')}'`;
    }

    if (neededProps.indexOf('id') !== -1 && isNaN(props.id)) {
        return "'id' must be 'integer'";
    }

    if (neededProps.indexOf('name') !== -1 && props.name.trim().length < 3) {
        return "'name' length must be more than 3 characters";
    }

    if (neededProps.indexOf('email') !== -1) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!regex.test(props.email)) {
            return "Wrong email format";
        }
    }
    
    return '';
}

class ClientController {
    async addClient(req, res) {
        const error = validate(req.body, ['name', 'email']);

        if(error) {
            res.status(400).json(error);
            return;
        }
        
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
        const error = validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const client = await db.query('SELECT * FROM client WHERE id=$1', [id]);
        res.json(client.rows[0]);
    }
    async updateClient(req, res) {
        const error = validate(req.body, ['id', 'name', 'email']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {id, name, email} = req.body;
        const client = await db.query('UPDATE client set name = $1, email = $2 where id = $3 RETURNING *', [name, email, id]);
        res.json(client.rows[0]);
    }
    async deleteClient(req, res) {
        const error = validate(req.params, ['id']);

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
        res.json(client.rows[0]);
    }
}

module.exports = new ClientController();
