import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      queryInterface.changeColumn(
        'Order',
        'cityId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'City',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      queryInterface.changeColumn(
        'Order',
        'clientId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Client',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      queryInterface.changeColumn(
        'Order',
        'masterId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Master',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      queryInterface.changeColumn(
        'Order',
        'statusId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Status',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
    ]);
  },

  async down(queryInterface: QueryInterface): Promise<void[]> {
    return Promise.all([
      queryInterface.removeConstraint('Order', 'Order_cityId_fkey'),
      queryInterface.removeConstraint('Order', 'Order_clientId_fkey'),
      queryInterface.removeConstraint('Order', 'Order_masterId_fkey'),
      queryInterface.removeConstraint('Order', 'Order_statusId_fkey')
    ]);
  }
};
