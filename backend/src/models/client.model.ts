import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export enum CLIENT_STATUSES {
    NOT_CONFIRMED = 'not confirmed',
    CONFIRMED = 'confirmed'
}

export interface ClientAttributes {
    id: number;
    name: string;
    userId: number;
    status: CLIENT_STATUSES;
}

export type ClientCreationAttributes = Optional<ClientAttributes, 'id'>;

export const Client: ModelDefined<ClientAttributes, ClientCreationAttributes> = sequelize.define(
    'Client',
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
        status: {
            type: DataTypes.ENUM(...Object.values(CLIENT_STATUSES)),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);
