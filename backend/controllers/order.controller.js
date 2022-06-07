const db = require('../db');

class OrderController {
    async addOrder(req, res) {
        const {client_id, master_id, city_id, watch_size, date, time} = req.body.params;
        const newOrder = await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time) values ($1, $2, $3, $4, $5, $6) RETURNING * `, [client_id, master_id, city_id, watch_size, date, time]);
        res.json(newOrder.rows[0]);
    }
    async getOrders(req, res) {
        const orders = await db.query('SELECT * FROM orders');
        res.json(orders.rows);
    }
    async getOrderById(req, res) {
        const id = req.params.id;
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
        res.json(order.rows[0]);
    }
    async updateOrder(req, res) {
        const {id, client_id, master_id, city_id, watch_size, date, time} = req.body.params;
        const order = await db.query('UPDATE orders set client_id = $1, master_id = $2, city_id = $3, watch_size = $4, date = $5, time = $6 where id = $7 RETURNING *', [client_id, master_id, city_id, watch_size, date, time, id]);
        res.json(order.rows[0]);
    }
    async deleteOrder(req, res) {
        const id = req.params.id;
        const order = await db.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id]);
        res.json(order.rows[0]);
    }
}

module.exports = new OrderController();
