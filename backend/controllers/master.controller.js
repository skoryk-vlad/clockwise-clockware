const db = require('../db');

class MasterController {
    async addMaster(req, res) {
        const {name, rating, city} = req.body;
        const newMaster = await db.query(`INSERT INTO master (name, rating, city_id) values ($1, $2, $3) RETURNING * `, [name, rating, city]);
        res.json(newMaster.rows[0]);
    }
    async getMasters(req, res) {
        let com = 'SELECT m.id, m.name, m.rating, c.name "city" FROM master m, city c WHERE m.city_id = c.id';
        const values = [];

        if(req.query.city_id) {
            com += ' AND m.city_id=$1';
            values.push(req.query.city_id);
        }

        const masters = await db.query(com, values);
        res.json(masters.rows);
    }
    async getMasterById(req, res) {
        const id = req.params.id;
        const master = await db.query('SELECT * FROM master WHERE id=$1', [id]);
        res.json(master.rows[0]);
    }
    async getAvailableMasters(req, res) {
        const {city_id, date, time, watch_size} = req.query;
        const notAvailmasters = await db.query('SELECT DISTINCT master_id FROM orders WHERE city_id=$1 AND date=$2 AND time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1', [city_id, date, time, watch_size]);
        const toDel = notAvailmasters.rows.map(m => m.master_id);
        const masters = await db.query('SELECT * FROM master WHERE city_id=$1', [city_id]);
        const resu = masters.rows.filter(m => toDel.indexOf(m.id) === -1);
        res.json(resu);
    }
    async updateMaster(req, res) {
        const {id, name, rating, city} = req.body;
        const master = await db.query('UPDATE master set name = $1, rating = $2, city_id = $3 where id = $4 RETURNING *', [name, rating, city, id]);
        res.json(master.rows[0]);
    }
    async deleteMaster(req, res) {
        const id = req.params.id;
        const master = await db.query('DELETE FROM master WHERE id=$1 RETURNING *', [id]);
        res.json(master.rows[0]);
    }
}

module.exports = new MasterController();
