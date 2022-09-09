'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Master extends Model {
    static associate(models: any) {
      Master.hasMany(models.Order, {
        foreignKey: 'masterId',
        as: 'Order'
      });
    }
  }
  Master.init({
    name: DataTypes.STRING,
    cities: DataTypes.ARRAY(DataTypes.INTEGER)
  }, {
    sequelize,
    modelName: 'Master',
  });
  return Master;
};