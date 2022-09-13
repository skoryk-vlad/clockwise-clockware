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

City.belongsToMany(Master, {
    through: CityMaster,
    foreignKey: 'cityId'
});
Master.belongsToMany(City, {
    through: CityMaster,
    foreignKey: 'masterId'
});
