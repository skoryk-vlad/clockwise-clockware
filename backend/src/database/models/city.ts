'use strict';
import { Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class City extends Model {
    static associate(models: any) {
      City.hasMany(models.CityMaster, {
        foreignKey: 'cityId',
        as: 'Order'
      });
    }
  }
  City.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'City',
  });
  return City;
};