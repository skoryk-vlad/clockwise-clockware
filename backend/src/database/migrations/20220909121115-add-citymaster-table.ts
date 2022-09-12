import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Master', 'cities'),
      await queryInterface.removeColumn('Order', 'cityId'),
      await queryInterface.removeColumn('Order', 'masterId'),
      await queryInterface.createTable('CityMaster', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        cityId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'City',
            key: 'id'
          }
        },
        masterId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Master',
            key: 'id'
          }
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }),
      await queryInterface.addColumn(
        'Order',
        'cityMasterId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'CityMaster',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      await queryInterface.addConstraint('CityMaster', {
        fields: ['cityId', 'masterId'],
        type: 'unique',
        name: 'CityMaster_ukey'
      })
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'cityMasterId'),
      await queryInterface.addColumn(
        'Order',
        'cityId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'City',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      await queryInterface.addColumn(
        'Order',
        'masterId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Master',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      await queryInterface.addColumn(
        'Master',
        'cities',
        {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          allowNull: false
        }
      ),
      await queryInterface.dropTable('CityMaster')
    ]);
  }
};
