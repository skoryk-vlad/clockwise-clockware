const db = require('../db');

const validate = async (props, neededProps) => {
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
    
    if (neededProps.indexOf('city') !== -1) {
        if(isNaN(props.city)) {
            return "'city' must be 'integer'";
        }
        const city = await db.query('SELECT * FROM city WHERE id=$1', [props.city]);
        if(city.rows.length === 0) {
            return "No such city";
        }
    }

    if (neededProps.indexOf('master') !== -1) {
        if(isNaN(props.master)) {
            return "'master' must be 'integer'";
        }
        const master = await db.query('SELECT * FROM master WHERE id=$1', [props.master]);
        if(master.rows.length === 0) {
            return "No such master";
        }
    }

    if (neededProps.indexOf('client') !== -1) {
        if(isNaN(props.client)) {
            return "'client' must be 'integer'";
        }
        const client = await db.query('SELECT * FROM client WHERE id=$1', [props.client]);
        if(client.rows.length === 0) {
            return "No such client";
        }
    }

    if (neededProps.indexOf('completed') !== -1 && (props.completed !== 'true' && props.completed !== 'false')) {
        return "'completed' must be 'true' or 'false'";
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
        const error = await validate(req.body, ['client', 'master', 'city', 'watch_size', 'date', 'time', 'completed']);

        if(error) {
            res.status(400).json(error);
            return;
        }

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
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [id]);
        res.json(order.rows[0]);
    }
    async updateOrder(req, res) {
        const error = await validate(req.body, ['id', 'client', 'master', 'city', 'watch_size', 'date', 'time', 'completed']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, client, master, city, watch_size, date, time, completed } = req.body;
        const order = await db.query('UPDATE orders set client_id = $1, master_id = $2, city_id = $3, watch_size = $4, date = $5, time = $6, completed = $8 where id = $7 RETURNING *', [client, master, city, watch_size, date, time, id, completed]);
        res.json(order.rows[0]);
    }
    async completeOrder(req, res) {
        const error = await validate(req.body, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id } = req.body;
        const order = await db.query('UPDATE orders set completed = true where id = $1 RETURNING *', [id]);
        res.json(order.rows[0]);
    }
    async deleteOrder(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const order = await db.query('DELETE FROM orders WHERE id=$1 RETURNING *', [id]);
        res.json(order.rows[0]);
    }
    async addOrderClient(req, res) {
        const error = await validate(req.body, ['name', 'email', 'master', 'city', 'watch_size', 'date', 'time']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { name, email, master, city, watch_size, date, time } = req.body;

        let client = (await db.query('SELECT * FROM client WHERE email=$1', [email])).rows;

        if(client.length === 0) {
            client = (await db.query(`INSERT INTO client (name, email) values ($1, $2) RETURNING * `, [name, email])).rows;
        }

        const newOrder = await db.query(`INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time) values ($1, $2, $3, $4, $5, $6) RETURNING * `, [client[0].id, master, city, watch_size, date, time]);
        
        // let com = 'do $$ declare selected_client client%rowtype; needed_email client.email%type := $1; begin select * from client into selected_client where email = needed_email; IF not found THEN INSERT INTO client (name, email) values ($2, needed_email); select * from client into selected_client where email = needed_email; END IF; INSERT INTO orders (client_id, master_id, city_id, watch_size, date, time) values (selected_client.id, $3, $4, $5, $6, &7); end $$';
        // await db.query(com, [email, name, master_id, city, watch_size, date, time]);

        res.json(newOrder);
    }
}

module.exports = new OrderController();
