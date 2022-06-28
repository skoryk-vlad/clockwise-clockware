const { Client } = require('pg');

const config = JSON.parse(process.env.DB_CONNECT);
if(config?.ssl?.rejectUnauthorized) {
  config.ssl.rejectUnauthorized = config.ssl.rejectUnauthorized === 'false' ? false : true;
}

const client = new Client(config);

client.connect();

module.exports = client;