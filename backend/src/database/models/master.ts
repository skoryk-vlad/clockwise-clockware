'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Master extends Model {
    static associate(models: any) {
      Master.hasMany(models.CityMaster, {
        foreignKey: 'masterId',
        as: 'Order'
      });
    }
  }
  Master.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Master',
  });
  return Master;
};