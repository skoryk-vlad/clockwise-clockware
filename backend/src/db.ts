import { Client, ClientConfig } from 'pg';

const config: ClientConfig = {
  connectionString: process.env.DB_CONNECT
}

const client: Client = new Client(config);

client.connect();

export default client;