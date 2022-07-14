const db = require('../db');

const validate = async (props, neededProps) => {
    const missing = neededProps.filter(prop => !props[prop]);
    
    if (missing.length !== 0) {
        return `Missing propert${missing.length === 1 ? 'y' : 'ies'} '${missing.join(', ')}'`;
    }

    if (neededProps.indexOf('id') !== -1 && isNaN(props.id)) {
        return "'id' must be 'integer'";
    }

    if (neededProps.indexOf('name') !== -1 && props.name.trim().length < 3) {
        return "'name' length must be more than 3 characters";
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

    if (neededProps.indexOf('cityId') !== -1) {
        if(isNaN(props.cityId)) {
            return "'cityId' must be 'integer'";
        }
        const city = await db.query('SELECT * FROM city WHERE id=$1', [props.cityId]);
        if(city.rows.length === 0) {
            return "No such city";
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
        const error = await validate(req.body, ['name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {name} = req.body;
        const newMaster = await db.query(`INSERT INTO master (name) values ($1) RETURNING * `, [name]);
        res.status(201).json(newMaster.rows[0]);
    }
    async getMasters(req, res) {
        let com = 'SELECT id, name FROM master';
        const values = [];

        const masters = await db.query(com, values);
        res.status(200).json(masters.rows);
    }
    async getMasterById(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const master = await db.query('SELECT * FROM master WHERE id=$1', [id]);
        res.status(200).json(master.rows[0]);
    }
    async getAvailableMasters(req, res) {
        const error = await validate(req.query, ['cityId', 'date', 'time', 'watch_size']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {cityId, date, time, watch_size} = req.query;
        const notAvailMasters = await db.query('SELECT DISTINCT master_id FROM orders WHERE city_id=$1 AND date=$2 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [cityId, date, time, watch_size]);
        const toDel = notAvailMasters.rows.map(m => m.master_id);

        const connections = await db.query('SELECT * FROM city_master WHERE city_id=$1', [cityId]);
        const cityMasterIds = connections.rows.map(c => c.master_id);

        const masterIds = cityMasterIds.filter(m => !toDel.includes(m));

        const masters = await db.query('SELECT * FROM master');

        let availMasters = masters.rows.filter(m => (masterIds.indexOf(m.id) !== -1));

        availMasters = await Promise.all(availMasters.map(async master => {
            const orders = await db.query('SELECT * FROM orders WHERE rating IS NOT NULL AND master_id=$1', [master.id]);
            let rating = 0, count = 0;
            orders.rows.forEach(o => {
                if(o.rating) {
                    rating += o.rating;
                    count++;
                }
            });
            return {...master, rating: (rating / count) ? (rating / count).toFixed(1) : null};
        }));

        res.status(200).json(availMasters);
    }
    async updateMaster(req, res) {
        const error = await validate(req.body, ['id', 'name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {id, name} = req.body;
        const master = await db.query('UPDATE master set name = $1 where id = $2 RETURNING *', [name, id]);
        res.status(200).json(master.rows[0]);
    }
    async deleteMaster(req, res) {
        let error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const masterConnections = await db.query('SELECT * FROM city_master WHERE master_id=$1', [id]);
        if(masterConnections.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'city_master' that depend on this master");
            return;
        }

        const masterOrders = await db.query('SELECT * FROM orders WHERE master_id=$1', [id]);
        if(masterOrders.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'orders' that depend on this master");
            return;
        }

        const master = await db.query('DELETE FROM master WHERE id=$1 RETURNING *', [id]);
        res.status(200).json(master.rows[0]);
    }
}

module.exports = new MasterController();
