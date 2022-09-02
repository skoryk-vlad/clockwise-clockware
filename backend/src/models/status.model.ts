import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface StatusAttributes {
    id: number;
    name: string;
}

type StatusCreationAttributes = Optional<StatusAttributes, 'id'>;

export const Status: ModelDefined<StatusAttributes, StatusCreationAttributes> = sequelize.define(
    'Status',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        createdAt: false,
        updatedAt: false,
    }
);