import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface MasterAttributes {
    id: number;
    name: string;
    cities: number[];
}

type MasterCreationAttributes = Optional<MasterAttributes, 'id'>;

export const Master: ModelDefined<MasterAttributes, MasterCreationAttributes> = sequelize.define(
    'Master',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cities: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);