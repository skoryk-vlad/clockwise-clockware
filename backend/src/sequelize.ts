import { Sequelize } from 'sequelize';

const DBInfo = {
    local: {
        connectString: process.env.DB_CONNECT,
        options: {
            logging: false
        }
    },
    production: {
        connectString: process.env.DB_CONNECT,
        options: {
            logging: false,
            dialectOptions: {
                ssl: {
                    rejectUnauthorized: false
                }
            }
        }
    }
};

const dbInfo = DBInfo[process.env.NODE_ENV.trim()];

export const sequelize = new Sequelize(dbInfo.connectString, dbInfo.options);
