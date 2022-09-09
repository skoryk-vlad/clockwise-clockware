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
      Order.belongsTo(models.Status, {
        foreignKey: 'statusId'
      });
    }
  }
  Order.init({
    watchSize: DataTypes.INTEGER,
    date: DataTypes.STRING,
    time: DataTypes.INTEGER,
    rating: DataTypes.INTEGER,
    cityId: DataTypes.INTEGER,
    clientId: DataTypes.INTEGER,
    masterId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};