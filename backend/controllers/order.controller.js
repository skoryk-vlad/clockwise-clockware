const db = require('../db');
const sendConfMail = require('../mailer');
const validate = require('../validate.js');

class OrderController {
    async addOrder(req, res) {
        const error = await validate(req.body, ['clientId', 'masterId', 'cityId', 'watch_size', 'date', 'time', 'statusId', 'rating']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { clientId, masterId, cityId, watch_size, date, time, statusId, rating } = req.body;

        const overlapsOrders = await db.query('SELECT * FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [cityId, date, time, watch_size, masterId]);

        if(overlapsOrders.rows.length !== 0) {
            res.status(400).json("The order overlaps with others. Select another master, date or time");
            return;
        }

        const newOrder = await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time, status_id, rating) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * `, [clientId, masterId, cityId, watch_size, date, time, statusId, rating]);
        res.status(201).json(newOrder.rows[0]);
    }
    async getOrders(req, res) {
        let com = 'SELECT o.id, cl.name "client", m.name "master", c.name "city", o.watch_size, o.date, o.time, o.rating, s.name "status" FROM orders o, city c, client cl, master m, status s WHERE o.city_id = c.id AND o.client_id = cl.id AND o.master_id = m.id AND o.status_id = s.id ORDER BY id';

        const orders = await db.query(com);
        res.status(200).json(orders.rows);
    }
    async getOrderById(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
        res.status(200).json(order.rows[0]);
    }
    async updateOrder(req, res) {
        const error = await validate(req.body, ['id', 'clientId', 'masterId', 'cityId', 'watch_size', 'date', 'time', 'statusId', 'rating']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, clientId, masterId, cityId, watch_size, date, time, statusId, rating } = req.body;

        const overlapsOrders = await db.query('SELECT * FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1 AND NOT(id=$6)', [cityId, date, time, watch_size, masterId, id]);

        if(overlapsOrders.rows.length !== 0) {
            res.status(400).json("The order overlaps with others. Select another master, date or time");
            return;
        }
        
        const order = await db.query('UPDATE orders set client_id = $1, master_id = $2, city_id = $3, watch_size = $4, date = $5, time = $6, status_id = $8, rating = $9 where id = $7 RETURNING *', [clientId, masterId, cityId, watch_size, date, time, id, statusId, rating]);
        res.status(200).json(order.rows[0]);
    }
    async changeStatus(req, res) {
        const error = await validate(req.body, ['id', 'statusId', 'rating']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, statusId, rating } = req.body;
        const order = await db.query('UPDATE orders set status_id = $2, rating = $3 where id = $1 RETURNING *', [id, statusId, rating]);
        res.status(200).json(order.rows[0]);
    }
    async deleteOrder(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const order = await db.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id]);
        res.status(200).json(order.rows[0]);
    }
    async addOrderClient(req, res) {
        const error = await validate(req.body, ['name', 'email', 'masterId', 'cityId', 'watch_size', 'date', 'time']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { name, email, masterId, cityId, watch_size, date, time } = req.body;

        const overlapsOrders = await db.query('SELECT * FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [cityId, date, time, watch_size, masterId]);

        if(overlapsOrders.rows.length !== 0) {
            res.status(400).json("The order overlaps with others. Select another master, date or time");
            return;
        }

        const newOrder = await db.query(`SELECT * FROM addOrderAndClient($1, $2, $3, $4, $5, $6, $7);`, [name, email, masterId, cityId, watch_size, date, time]);

        sendConfMail(email, newOrder.rows[0].id, name);

        res.status(201).json(newOrder.rows[0]);
    }
}

module.exports = new OrderController();
