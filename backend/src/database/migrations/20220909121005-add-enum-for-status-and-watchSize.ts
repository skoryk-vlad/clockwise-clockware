import { QueryInterface } from 'sequelize';

enum STATUSES {
  AWAITING_CONFIRMATION = 'awaiting confirmation',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
enum WATCH_SIZES {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big'
}

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'endTime',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      await queryInterface.removeColumn('Order', 'watchSize'),
      await queryInterface.addColumn(
        'Order',
        'watchSize',
        {
          type: Sequelize.ENUM(...Object.values(WATCH_SIZES)),
          allowNull: false
        }
      ),
      await queryInterface.removeColumn('Order', 'statusId'),
      await queryInterface.dropTable('Status'),
      await queryInterface.addColumn(
        'Order',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(STATUSES)),
          allowNull: false
        }
      ),
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'status'),
      await queryInterface.createTable('Status', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
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
        'statusId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
        }
      ),
      await queryInterface.removeColumn('Order', 'watchSize'),
      await queryInterface.addColumn(
        'Order',
        'watchSize',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      )
    ]);
  }
};
