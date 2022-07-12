const db = require('../db');

class StatusController {
    async getStatuses(req, res) {
        const statuses = await db.query('SELECT * FROM status');
        res.status(200).json(statuses.rows);
    }
}

module.exports = new StatusController();
