'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Client extends Model {
    static associate(models: any) {
      Client.hasMany(models.Order, {
        foreignKey: 'clientId',
        as: 'Order'
      });
    }
  }
  Client.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Client',
  });
  return Client;
};