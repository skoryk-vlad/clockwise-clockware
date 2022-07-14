const db = require('../db');
const sendConfMail = require('../mailer');
const jwt = require('jsonwebtoken');

const validate = async (props, neededProps) => {
    const missing = neededProps.filter(prop => !props[prop] && (prop !== 'rating' || props.rating != 0));
    
    if (missing.length !== 0) {
        return `Missing propert${missing.length === 1 ? 'y' : 'ies'} '${missing.join(', ')}'`;
    }

    if (neededProps.indexOf('id') !== -1 && isNaN(props.id)) {
        return "'id' must be 'integer'";
    }

    if (neededProps.indexOf('watch_size') !== -1) {
        if(isNaN(props.watch_size)) {
            return "'watch_size' must be 'integer'";
        }
        if(props.watch_size < 1 || props.watch_size > 3) {
            return "'watch_size' must be between 1 and 3";
        }
    }

    if (neededProps.indexOf('time') !== -1) {
        if(isNaN(props.time)) {
            return "'time' must be 'integer'";
        }
        if(props.time < 10 || props.time > 18) {
            return "'time' must be between 10 and 18";
        }
    }

    if (neededProps.indexOf('date') !== -1) {
        const date = props.date.split('-')
        if(date.length !== 3) {
            return "Wrong date format";
        }
        if(isNaN(date[0])) {
            return "Wrong year in date";
        }
        if(isNaN(date[1]) || date[1] < 1 || date[1] > 12) {
            return "Wrong month in date";
        }
        if(isNaN(date[2]) || date[2] < 1 || date[2] > 31) {
            return "Wrong day in date";
        }
    }
    
    if (neededProps.indexOf('cityId') !== -1) {
        if(isNaN(props.cityId)) {
            return "'cityId' must be 'integer'";
        }
        const city = await db.query('SELECT * FROM city WHERE id=$1', [props.cityId]);
        if(city.rows.length === 0) {
            return "No such city";
        }
    }

    if (neededProps.indexOf('masterId') !== -1) {
        if(isNaN(props.masterId)) {
            return "'masterId' must be 'integer'";
        }
        const master = await db.query('SELECT * FROM master WHERE id=$1', [props.masterId]);
        if(master.rows.length === 0) {
            return "No such master";
        }
    }

    if (neededProps.indexOf('clientId') !== -1) {
        if(isNaN(props.clientId)) {
            return "'clientId' must be 'integer'";
        }
        const client = await db.query('SELECT * FROM client WHERE id=$1', [props.clientId]);
        if(client.rows.length === 0) {
            return "No such client";
        }
    }

    if (neededProps.indexOf('statusId') !== -1) {
        if(isNaN(props.statusId)) {
            return "'statusId' must be 'integer'";
        }
        const status = await db.query('SELECT * FROM status WHERE id=$1', [props.statusId]);
        if(status.rows.length === 0) {
            return "No such status";
        }
    }
    
    if (neededProps.indexOf('rating') !== -1) {
        if(isNaN(props.rating)) {
            return "'rating' must be 'integer'";
        }
        if(props.rating < 0 || props.rating > 5) {
            return "'rating' must be between 0 and 5";
        }
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
        let com = 'SELECT o.id, cl.name "client", m.name "master", c.name "city", o.watch_size, o.date, o.time, o.rating, s.name "status" FROM orders o, city c, client cl, master m, status s WHERE o.city_id = c.id AND o.client_id = cl.id AND o.master_id = m.id AND o.status_id = s.id';

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

        const overlapsOrders = await db.query('SELECT * FROM orders WHERE city_id=$1 AND date=$2 AND master_id=$5 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [cityId, date, time, watch_size, masterId]);

        if(overlapsOrders.rows.length !== 0 && !overlapsOrders.rows.find(o => o.id = id)) {
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

        const com = `do $$ declare selected_client client%rowtype;
                     needed_email client.email%type := '${email}';
                     begin select * from client into selected_client where email = needed_email;
                     IF not found THEN INSERT INTO client (name, email) values ('${name}', needed_email);
                     select * from client into selected_client where email = needed_email; END IF;
                     INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time)
                     values (selected_client.id, '${masterId}', '${cityId}', '${watch_size}', '${date}', '${time}'); end $$;
                     select * from orders where id=(select max(id) from orders);`;

        const newOrder = await db.query(com);

        const token = jwt.sign({ orderId: newOrder[1].rows[0].id }, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'});

        const link = `${process.env.BASE_LINK}/confirmation/${token}`;
    
        sendConfMail(email, link);

        res.status(201).json(newOrder[1].rows[0]);
    }
}

module.exports = new OrderController();
