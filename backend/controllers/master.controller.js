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

    if (neededProps.indexOf('name') !== -1 && props.name.trim().length < 3) {
        return "'name' length must be more than 3 characters";
    }

    if (neededProps.indexOf('rating') !== -1) {
        if(isNaN(props.rating)) {
            return "'rating' must be 'integer'";
        }
        if(props.rating < 1 || props.rating > 5) {
            return "'rating' must be between 1 and 5";
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

    return '';
}

class MasterController {
    async addMaster(req, res) {
        const error = await validate(req.body, ['name', 'rating', 'city']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {name, rating, city} = req.body;
        const newMaster = await db.query(`INSERT INTO master (name, rating, city_id) values ($1, $2, $3) RETURNING * `, [name, rating, city]);
        res.json(newMaster.rows[0]);
    }
    async getMasters(req, res) {
        let com = 'SELECT m.id, m.name, m.rating, c.name "city" FROM master m, city c WHERE m.city_id = c.id';
        const values = [];

        if(req.query.city_id) {
            if(isNaN(req.query.city_id)) {
                res.status(400).json("'city_id' must be 'integer'");
                return;
            }
            com += ' AND m.city_id=$1';
            values.push(req.query.city_id);
        }

        const masters = await db.query(com, values);
        res.json(masters.rows);
    }
    async getMasterById(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const master = await db.query('SELECT * FROM master WHERE id=$1', [id]);
        res.json(master.rows[0]);
    }
    async getAvailableMasters(req, res) {
        const error = await validate(req.query, ['city', 'date', 'time', 'watch_size']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {city, date, time, watch_size} = req.query;
        const notAvailmasters = await db.query('SELECT DISTINCT master_id FROM orders WHERE city_id=$1 AND date=$2 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [city, date, time, watch_size]);
        const toDel = notAvailmasters.rows.map(m => m.master_id);
        const masters = await db.query('SELECT * FROM master WHERE city_id=$1', [city]);
        const resu = masters.rows.filter(m => toDel.indexOf(m.id) === -1);
        res.json(resu);
    }
    async updateMaster(req, res) {
        const error = await validate(req.body, ['id', 'name', 'rating', 'city']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {id, name, rating, city} = req.body;
        const master = await db.query('UPDATE master set name = $1, rating = $2, city_id = $3 where id = $4 RETURNING *', [name, rating, city, id]);
        res.json(master.rows[0]);
    }
    async deleteMaster(req, res) {
        let error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const masterOrders = await db.query('SELECT * FROM orders WHERE master_id=$1', [id]);
        if(masterOrders.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'orders' that depend on this master");
            return;
        }

        const master = await db.query('DELETE FROM master WHERE id=$1 RETURNING *', [id]);
        res.json(master.rows[0]);
    }
}

module.exports = new MasterController();
