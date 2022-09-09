'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Status extends Model {
    static associate(models: any) {
      Status.hasMany(models.Order, {
        foreignKey: 'statusId',
        as: 'Order'
      });
    }
  }
  Status.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Status',
  });
  return Status;
};