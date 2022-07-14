const db = require('../db');

const validate = async (props, neededProps) => {
    const missing = neededProps.filter(prop => !props[prop]);
    
    if (missing.length !== 0) {
        return `Missing propert${missing.length === 1 ? 'y' : 'ies'} '${missing.join(', ')}'`;
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
    
    return '';
}

class CityMasterController {
    async addConnection(req, res) {
        const error = await validate(req.body, ['cityId', 'masterId']);

        if(error) {
            res.status(400).json('error');
            return;
        }

        const { cityId, masterId } = req.body;

        let connection = await db.query('SELECT * FROM city_master WHERE city_id=$1 AND master_id=$2', [cityId, masterId]);

        if(connection.rows.length === 0) {
            connection = await db.query(`INSERT INTO city_master (city_id, master_id) values ($1, $2) RETURNING * `, [cityId, masterId]);
        }

        res.status(201).json(connection.rows[0]);
    }
    async getConnections(req, res) {
        const connections = await db.query('SELECT cm.id, c.name "city", m.name "master" FROM city_master cm, city c, master m WHERE cm.city_id=c.id AND cm.master_id=m.id');
        res.status(200).json(connections.rows);
    }
    async getConnectionsId(req, res) {
        const connections = await db.query('SELECT * FROM city_master');
        res.status(200).json(connections.rows);
    }
    async updateConnection(req, res) {
        const error = await validate(req.body, ['id', 'cityId', 'masterId']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, cityId, masterId } = req.body;

        let connection = await db.query('SELECT * FROM city_master WHERE city_id=$1 AND master_id=$2', [cityId, masterId]);

        if(connection.rows.length === 0) {
            connection = await db.query(`UPDATE city_master set city_id = $1, master_id = $2 where id = $3 RETURNING *`, [cityId, masterId, id]);
        }

        res.status(200).json(connection.rows[0]);
    }
    async deleteConnection(req, res) {
        let error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        // const cityMasters = await db.query('SELECT * FROM master WHERE city_id=$1', [id]);
        // if(cityMasters.rows.length !== 0) {
        //     res.status(400).json("There are rows in the table 'master' that depend on this city");
        //     return;
        // }
        // const cityOrders = await db.query('SELECT * FROM orders WHERE city_id=$1', [id]);
        // if(cityOrders.rows.length !== 0) {
        //     res.status(400).json("There are rows in the table 'orders' that depend on this city");
        //     return;
        // }

        const connection = await db.query('DELETE FROM city_master WHERE id=$1 RETURNING *', [id]);
        res.status(200).json(connection.rows[0]);
    }
}

module.exports = new CityMasterController();
