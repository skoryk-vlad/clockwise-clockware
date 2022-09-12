'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class CityMaster extends Model {
    static associate(models: any) {
      CityMaster.belongsTo(models.City, {
        foreignKey: 'cityId'
      });
      CityMaster.belongsTo(models.Master, {
        foreignKey: 'masterId'
      });
      CityMaster.hasMany(models.Order, {
        foreignKey: 'cityMasterId',
        as: 'Order'
      });
    }
  }
  CityMaster.init({
    cityId: DataTypes.INTEGER,
    masterId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'CityMaster',
  });
  return CityMaster;
};