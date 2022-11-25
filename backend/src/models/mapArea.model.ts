import { City } from './city.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface MapAreaAttributes {
    id: number;
    area: Array<Array<Array<number>>>;
    cityId: number;
}

type MapAreaCreationAttributes = Optional<MapAreaAttributes, 'id'>;

export const MapArea: ModelDefined<MapAreaAttributes, MapAreaCreationAttributes> = sequelize.define(
    'MapArea',
    {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        area: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

MapArea.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(MapArea, { foreignKey: 'cityId', as: 'MapArea' });