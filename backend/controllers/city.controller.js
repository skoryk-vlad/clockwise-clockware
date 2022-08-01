const db = require('../db');
const validate = require('../validate.js');

class CityController {
    async addCity(req, res) {
        const error = await validate(req.body, ['name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { name } = req.body;
        const city = await db.query(`SELECT * FROM addCity($1)`, [name]);
        res.status(201).json(city.rows[0]);
    }
    async getCities(req, res) {
        const cities = await db.query('SELECT * FROM city ORDER BY id');
        // res.set({
        //     'page-size': 20,
        //     'Access-Control-Expose-Headers': 'page-size',
        //     'Access-Control-Allow-Origin': '*'
        // })
        res.status(200).json(cities.rows);
    }
    async getCityById(req, res) {
        const error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const city = await db.query('SELECT * FROM city WHERE id=$1', [id]);
        res.status(200).json(city.rows[0]);
    }
    async updateCity(req, res) {
        const error = await validate(req.body, ['id', 'name']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const { id, name } = req.body;
        const city = await db.query(`SELECT * FROM updateCity($1, $2);`, [id,name]);
        res.status(200).json(city.rows[0]);
    }
    async deleteCity(req, res) {
        let error = await validate(req.params, ['id']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const id = req.params.id;
        const cityMasters = await db.query('SELECT * FROM master WHERE $1 = ANY (cities)', [id]);
        if(cityMasters.rows.length !== 0) {
            res.status(400).json("There are rows in the table 'master' that depend on this city");
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
