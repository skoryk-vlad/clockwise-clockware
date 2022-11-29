import { Sequelize } from 'sequelize';

const DBOptions = {
    local: {
        logging: false
    },
    production: {
        logging: false,
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    },
    test: {
        logging: false
    },
    "test.production": {
        logging: false
    },
};

export const sequelize = new Sequelize(process.env.DB_CONNECT, DBOptions[process.env.NODE_ENV.trim()]);
