import { Master } from './master.model';
import { Client } from './client.model';
import { sequelize } from '../sequelize';
import { DataTypes, Optional, ModelDefined } from 'sequelize';

export enum ROLES {
    ADMIN = 'admin',
    MASTER = 'master',
    CLIENT = 'client'
}

export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: ROLES;
    confirmationToken: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define(
    'User',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.ENUM(...Object.values(ROLES)),
            allowNull: false
        },
        confirmationToken: {
            type: DataTypes.UUID,
            allowNull: false
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    },
    {
        freezeTableName: true
    }
);

User.hasOne(Client, { foreignKey: 'userId' });
Client.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Master, { foreignKey: 'userId' });
Master.belongsTo(User, { foreignKey: 'userId' });