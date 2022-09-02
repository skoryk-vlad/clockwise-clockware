import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface ClientAttributes {
    id: number;
    name: string;
    email: string;
}

type ClientCreationAttributes = Optional<ClientAttributes, 'id'>;

export const Client: ModelDefined<ClientAttributes, ClientCreationAttributes> = sequelize.define(
    'Client',
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
        email: {
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