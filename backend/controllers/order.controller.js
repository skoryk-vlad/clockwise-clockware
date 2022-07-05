const db = require('../db');

class OrderController {
    async addOrder(req, res) {
        const { client, master, city, watch_size, date, time, completed } = req.body;
        const newOrder = await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time, completed) values ($1, $2, $3, $4, $5, $6, $7) RETURNING * `, [client, master, city, watch_size, date, time, completed]);
        res.json(newOrder.rows[0]);
    }
    async getOrders(req, res) {
        let com = 'SELECT o.id, cl.name "client", m.name "master", c.name "city", o.watch_size, o.date, o.time, completed FROM orders o, city c, client cl, master m WHERE o.city_id = c.id AND o.client_id = cl.id AND o.master_id = m.id';

        const orders = await db.query(com);
        res.json(orders.rows);
    }
    async getOrderById(req, res) {
        const id = req.params.id;
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
        res.json(order.rows[0]);
    }
    async updateOrder(req, res) {
        const { id, client, master, city, watch_size, date, time, completed } = req.body;
        const order = await db.query('UPDATE orders set client_id = $1, master_id = $2, city_id = $3, watch_size = $4, date = $5, time = $6, completed = $8 where id = $7 RETURNING *', [client, master, city, watch_size, date, time, id, completed]);
        res.json(order.rows[0]);
    }
    async completeOrder(req, res) {
        const { id } = req.body;
        const order = await db.query('UPDATE orders set completed = true where id = $1 RETURNING *', [id]);
        res.json(order.rows[0]);
    }
    async deleteOrder(req, res) {
        const id = req.params.id;
        const order = await db.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id]);
        res.json(order.rows[0]);
    }
    async addOrderClient(req, res) {
        const { email, name, master_id, city, watch_size, date, time } = req.body;

        let client = (await db.query('SELECT * FROM client WHERE email=$1', [email])).rows;

        if(client.length === 0) {
            client = (await db.query(`INSERT INTO client (name, email) values ($1, $2) RETURNING * `, [name, email])).rows;
        }

        const newOrder = await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time) values ($1, $2, $3, $4, $5, $6) RETURNING * `, [client[0].id, master_id, city, watch_size, date, time]);
        
        // let com = 'do $$ declare selected_client client%rowtype; needed_email client.email%type := $1; begin select * from client into selected_client where email = needed_email; IF not found THEN INSERT INTO client (name, email) values ($2, needed_email); select * from client into selected_client where email = needed_email; END IF; INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time) values (selected_client.id, $3, $4, $5, $6, &7); end $$';
        // await db.query(com, [email, name, master_id, city, watch_size, date, time]);

        res.json(newOrder);
    }
}

module.exports = new OrderController();
