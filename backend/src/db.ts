import { Client } from 'pg';

const config: any = JSON.parse(process.env.DB_CONNECT);
if(config?.ssl?.rejectUnauthorized) {
  config.ssl.rejectUnauthorized = config.ssl.rejectUnauthorized === 'false' ? false : true;
}

const client: Client = new Client(config);

client.connect();

export default client;