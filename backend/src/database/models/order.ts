'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Order extends Model {
    static associate(models: any) {
      Order.belongsTo(models.City, {
        foreignKey: 'cityId'
      });
      Order.belongsTo(models.Client, {
        foreignKey: 'clientId'
      });
      Order.belongsTo(models.Master, {
        foreignKey: 'masterId'
      });
    }
  }
  Order.init({
    watchSize: DataTypes.ENUM('small', 'medium', 'big'),
    date: DataTypes.STRING,
    time: DataTypes.INTEGER,
    endTime: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    cityMasterId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    status: DataTypes.ENUM('awaiting confirmation', 'confirmed', 'completed', 'canceled'),
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};