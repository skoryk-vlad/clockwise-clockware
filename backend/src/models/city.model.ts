import { sequelize } from './../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface CityAttributes {
    id: number;
    name: string;
}

type CityCreationAttributes = Optional<CityAttributes, 'id'>;

export const City: ModelDefined<CityAttributes,CityCreationAttributes> = sequelize.define(
    'City',
    {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);
