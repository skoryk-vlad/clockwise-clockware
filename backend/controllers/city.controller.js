const db = require('../db');

const validate = (props, neededProps) => {
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
    
    return '';
}

class CityController {
    async addCity(req, res) {
        const error = validate(req.body, ['name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { name } = req.body;

        let city = await db.query('SELECT * FROM city WHERE name=$1', [name]);

        if(city.rows.length === 0) {
            city = await db.query(`INSERT INTO city (name) values ($1) RETURNING * `, [name]);
        }

        res.status(201).json(city.rows[0]);
    }
    async getCities(req, res) {
        const cities = await db.query('SELECT * FROM city');
        res.status(200).json(cities.rows);
    }
    async getCityById(req, res) {
        const error = validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const city = await db.query('SELECT * FROM city WHERE id=$1', [id]);
        res.status(200).json(city.rows[0]);
    }
    async updateCity(req, res) {
        const error = validate(req.body, ['id', 'name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, name } = req.body;

        let city = await db.query('SELECT * FROM city WHERE name=$1', [name]);

        if(city.rows.length === 0) {
            city = await db.query('UPDATE city set name = $1 where id = $2 RETURNING *', [name, id]);
        }
        
        res.status(200).json(city.rows[0]);
    }
    async deleteCity(req, res) {
        let error = validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const cityConnections = await db.query('SELECT * FROM city_master WHERE city_id=$1', [id]);
        if(cityConnections.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'city_master' that depend on this city");
            return;
        }
        const cityOrders = await db.query('SELECT * FROM orders WHERE city_id=$1', [id]);
        if(cityOrders.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'orders' that depend on this city");
            return;
        }

        const city = await db.query('DELETE FROM city WHERE id=$1 RETURNING *', [id]);
        res.status(200).json(city.rows[0]);
    }
}

module.exports = new CityController();
