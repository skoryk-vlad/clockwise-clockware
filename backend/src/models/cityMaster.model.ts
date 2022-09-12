import { Master } from './master.model';
import { City } from './city.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface CityMasterAttributes {
    id: number;
    cityId: number;
    masterId: number;
}

type CityMasterCreationAttributes = Optional<CityMasterAttributes, 'id'>;

export const CityMaster: ModelDefined<CityMasterAttributes, CityMasterCreationAttributes> = sequelize.define(
    'CityMaster',
    {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);

CityMaster.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(CityMaster, {foreignKey: 'cityId', as: 'CityMaster'});

CityMaster.belongsTo(Master, { foreignKey: 'masterId' });
Master.hasMany(CityMaster, {foreignKey: 'masterId', as: 'CityMaster'});