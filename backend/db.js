const pg = require('pg');
const pool = new pg.Pool({
    user: 'postgres',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'clockware'
});

module.exports = pool;