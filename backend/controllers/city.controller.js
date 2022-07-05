const db = require('../db');

class CityController {
    async addCity(req, res) {
        const {name} = req.body;
        const newCity = await db.query(`INSERT INTO city (name) values ($1) RETURNING * `, [name]);
        res.json(newCity.rows[0]);
    }
    async getCities(req, res) {
        const cities = await db.query('SELECT * FROM city');
        res.json(cities.rows);
    }
    async getCityById(req, res) {
        const id = req.params.id;
        const city = await db.query('SELECT * FROM city WHERE id=$1', [id]);
        res.json(city.rows[0]);
    }
    async updateCity(req, res) {
        const {id, name} = req.body;
        const city = await db.query('UPDATE city set name = $1 where id = $2 RETURNING *', [name, id]);
        res.json(city.rows[0]);
    }
    async deleteCity(req, res) {
        const id = req.params.id;
        const city = await db.query('DELETE FROM city WHERE id=$1 RETURNING *', [id]);
        res.json(city.rows[0]);
    }
}

module.exports = new CityController();
