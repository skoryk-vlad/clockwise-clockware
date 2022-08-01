const db = require('../db');
const validate = require('../validate.js');

class MasterController {
    async addMaster(req, res) {
        const error = await validate(req.body, ['name', 'cities']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {name, cities} = req.body;
        const newMaster = await db.query(`INSERT INTO master (name, cities) values ($1, $2) RETURNING * `, [name, `{${cities.join(',')}}`]);
        res.status(201).json(newMaster.rows[0]);
    }
    async getMasters(req, res) {
        const masters = await db.query('select m.id, m.name, m.cities, round(avg(o.rating) filter(where o.rating > 0), 1) "rating" from master m, orders o where m.id = o.master_id group by m.id; SELECT *, null "rating" FROM master WHERE id NOT IN (SELECT master_id FROM orders WHERE master_id IS NOT NULL)');
        
        res.status(200).json([...masters[0].rows, ...masters[1].rows].sort((a,b) => a.id - b.id));
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
        
        const masters = await db.query(`SELECT m.id, m.name, ROUND(AVG(o.rating) FILTER(WHERE o.rating > 0 AND o.master_id = m.id), 1) "rating"
                                                                        FROM master m, orders o WHERE m.id IN (SELECT id FROM master WHERE $1 = ANY (cities) AND
                                                                        id NOT IN (SELECT DISTINCT master_id FROM orders WHERE city_id=$1 AND date=$2 AND
                                                                        time BETWEEN $3 - watch_size + 1 AND $3 + $4 - 1)) AND
                                                                        (m.id = o.master_id OR NOT EXISTS (SELECT * FROM orders WHERE master_id=m.id))
                                                                        GROUP BY m.id ORDER BY rating DESC NULLS LAST, id;`,
                                                                        [cityId, date, time, watch_size]); 
        
        res.status(200).json(masters.rows);
    }
    async updateMaster(req, res) {
        const error = await validate(req.body, ['id', 'name', 'cities']);

        if(error) {
            res.status(400).json(error);
            return;
        }

        const {id, name, cities} = req.body;
        const master = await db.query('UPDATE master set name = $1, cities = $2 where id = $3 RETURNING *', [name, `{${cities.join(',')}}`, id]);
        res.status(200).json(master.rows[0]);
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
        res.status(200).json(master.rows[0]);
    }
}

module.exports = new MasterController();
