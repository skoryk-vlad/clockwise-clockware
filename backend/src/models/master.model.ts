import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export enum MASTER_STATUSES {
    NOT_CONFIRMED = 'not confirmed',
    CONFIRMED = 'confirmed',
    APPROVED = 'approved'
}

export interface MasterAttributes {
    id: number;
    name: string;
    userId: number;
    status: MASTER_STATUSES;
}

type MasterCreationAttributes = Optional<MasterAttributes, 'id'>;

export const Master: ModelDefined<MasterAttributes, MasterCreationAttributes> = sequelize.define(
    'Master',
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
            type: DataTypes.ENUM(...Object.values(MASTER_STATUSES)),
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);
