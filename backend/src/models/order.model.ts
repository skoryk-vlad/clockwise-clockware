import { City } from './city.model';
import { Master } from './master.model';
import { Client } from './client.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export enum ORDER_STATUSES {
    AWAITING_PAYMENT = 'awaiting payment',
    PAID = 'paid',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}
export enum WATCH_SIZES {
    SMALL = 'small',
    MEDIUM = 'medium',
    BIG = 'big'
}
type WatchSizesType = Partial<Record<WATCH_SIZES, number>>;
export const WatchSizes: WatchSizesType = {
    [WATCH_SIZES.SMALL]: 1,
    [WATCH_SIZES.MEDIUM]: 2,
    [WATCH_SIZES.BIG]: 3
}

type WatchSizesTranslateType = Partial<Record<WATCH_SIZES, string>>;
export const WatchSizesTranslate: WatchSizesTranslateType = {
    [WATCH_SIZES.SMALL]: 'Маленькие',
    [WATCH_SIZES.MEDIUM]: 'Средние',
    [WATCH_SIZES.BIG]: 'Большие'
}
const WatchSizesTranslateValues = Object.values(WatchSizesTranslate);
type WatchSizesTranslateValuesType = typeof WatchSizesTranslateValues[number];

type OrderStatusesTranslateType = Partial<Record<ORDER_STATUSES, string>>;
export const OrderStatusesTranslate: OrderStatusesTranslateType = {
    [ORDER_STATUSES.AWAITING_PAYMENT]: 'Ожидает оплаты',
    [ORDER_STATUSES.PAID]: 'Оплачен',
    [ORDER_STATUSES.COMPLETED]: 'Выполнен',
    [ORDER_STATUSES.CANCELED]: 'Отменен'
}
const OrderStatusesTranslateValues = Object.values(OrderStatusesTranslate);
type OrderStatusesTranslateValuesType = typeof OrderStatusesTranslateValues[number];

export type OrderReportType = {
    id: number;
    watchSize: WatchSizesTranslateValuesType;
    status: OrderStatusesTranslateValuesType;
    date: string;
    time: number;
    endTime: number;
    city: string;
    client: string;
    master: string;
    price: number;
    rating: number;
    review: string;
}
export type OrderReportAttributes = keyof OrderReportType;

export type OrderTableColumn = {
    value: OrderReportAttributes;
    columnTitle: string;
}

export interface OrderAttributes {
    id: number;
    watchSize: WATCH_SIZES;
    date: string;
    time: number;
    endTime: number;
    rating: number;
    clientId: number;
    cityId: number;
    masterId: number;
    status: ORDER_STATUSES;
    price: number;
    reviewToken: string;
    review: string;
    paypalInvoiceId: string;
    imagesLinks: string[];
    address: string;
    lngLat: number[];
}

export type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

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
            type: DataTypes.ENUM(...Object.values(WATCH_SIZES)),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(ORDER_STATUSES)),
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
        price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        reviewToken: {
            type: DataTypes.UUID,
            allowNull: false
        },
        review: {
            type: DataTypes.TEXT
        },
        paypalInvoiceId: {
            type: DataTypes.STRING
        },
        imagesLinks: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        address: {
            type: DataTypes.STRING
        },
        lngLat: {
            type: DataTypes.ARRAY(DataTypes.DOUBLE)
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);

Order.belongsTo(City, { foreignKey: 'cityId' });
City.hasMany(Order, { foreignKey: 'cityId', as: 'Order' });

Order.belongsTo(Master, { foreignKey: 'masterId' });
Master.hasMany(Order, { foreignKey: 'masterId', as: 'Order' });

Order.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasMany(Order, { foreignKey: 'clientId', as: 'Order' });
