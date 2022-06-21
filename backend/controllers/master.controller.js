const db = require('../db');

class MasterController {
    async addMaster(req, res) {
        const {name, rating, city_id} = req.body.params;
        const newMaster = await db.query(`INSERT INTO master (name, rating, city_id) values ($1, $2, $3) RETURNING * `, [name, rating, city_id]);
        res.json(newMaster.rows[0]);
    }
    async getMasters(req, res) {
        let com = 'SELECT * FROM master';

        if(req.query.city_id) {
            com += ` WHERE city_id=${req.query.city_id}`;
        }

        const masters = await db.query(com);
        res.json(masters.rows);
    }
    async getMasterById(req, res) {
        const id = req.params.id;
        const master = await db.query('SELECT * FROM master WHERE id=$1', [id]);
        res.json(master.rows[0]);
    }
    async updateMaster(req, res) {
        const {id, name, rating, city_id} = req.body.params;
        const master = await db.query('UPDATE master set name = $1, rating = $2, city_id = $3 where id = $4 RETURNING *', [name, rating, city_id, id]);
        res.json(master.rows[0]);
    }
    async deleteMaster(req, res) {
        const id = req.params.id;
        const master = await db.query('DELETE FROM master WHERE id=$1 RETURNING *', [id]);
        res.json(master.rows[0]);
    }
}

module.exports = new MasterController();
