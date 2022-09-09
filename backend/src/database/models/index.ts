'use strict';

import * as fs from 'fs';
import * as path from 'path';
import sequelizeObject, { Sequelize } from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV.trim() || 'prod';
const config = require(__dirname + '/../config/config')[env];
const db = {
  sequelize: {},
  Sequelize: {}
};

let sequelize: Sequelize;
if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, sequelizeObject.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
