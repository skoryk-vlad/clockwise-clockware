import { Status } from './status.model';
import { Master } from './master.model';
import { Client } from './client.model';
import { City } from './city.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export interface OrderAttributes {
    id: number;
    watchSize: number;
    date: string;
    time: number;
    rating: number;
    clientId: number;
    masterId: number;
    cityId: number;
    statusId: number;
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
            type: DataTypes.INTEGER,
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

City.hasMany(Order, {foreignKey: 'cityId', as: 'Order'});
Order.belongsTo(City, {foreignKey: 'cityId'});

Client.hasMany(Order, {foreignKey: 'clientId', as: 'Order'});
Order.belongsTo(Client, {foreignKey: 'clientId'});

Master.hasMany(Order, {foreignKey: 'masterId', as: 'Order'});
Order.belongsTo(Master, {foreignKey: 'masterId'});

Status.hasMany(Order, {foreignKey: 'statusId', as: 'Order'});
Order.belongsTo(Status, {foreignKey: 'statusId'});
