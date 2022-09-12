import { CityMaster } from './cityMaster.model';
import { Client } from './client.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface OrderAttributes {
    id: number;
    watchSize: string;
    date: string;
    time: number;
    endTime: number;
    rating: number;
    clientId: number;
    cityMasterId: number;
    status: string;
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

export const Order: ModelDefined<OrderAttributes, OrderCreationAttributes> = sequelize.define(
    'Order',
    {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        watchSize: {
            type: DataTypes.ENUM('small', 'medium', 'big'),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('awaiting confirmation', 'confirmed', 'completed', 'canceled'),
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        endTime: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);

Order.belongsTo(CityMaster, {foreignKey: 'cityMasterId'});
CityMaster.hasMany(Order, { foreignKey: 'cityMasterId', as: 'Order' });

Order.belongsTo(Client, {foreignKey: 'clientId'});
Client.hasMany(Order, {foreignKey: 'clientId', as: 'Order'});
