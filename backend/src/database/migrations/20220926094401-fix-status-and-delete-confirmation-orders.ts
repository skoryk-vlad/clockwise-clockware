import { QueryInterface } from 'sequelize';

enum ORDER_STATUSES {
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
enum OLD_ORDER_STATUSES {
  AWAITING_CONFIRMATION = 'awaiting confirmation',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.TEXT,
        },
      ),
      await queryInterface.sequelize.query(`update "Order" set status='confirmed' where status='awaiting confirmation';`),
      await queryInterface.sequelize.query('drop type "enum_Order_status";'),
      await queryInterface.sequelize.query('alter table "Order" alter status drop default;'),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(ORDER_STATUSES)),
          allowNull: false
        }
      ),
      await queryInterface.removeColumn('Order', 'confirmationToken')
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'confirmationToken',
        {
          type: Sequelize.UUID
        }
      ),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.TEXT,
        },
      ),
      await queryInterface.sequelize.query('drop type "enum_Order_status";'),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(OLD_ORDER_STATUSES)),
          allowNull: false,
          defaultValue: OLD_ORDER_STATUSES.AWAITING_CONFIRMATION
        }
      ),
    ]);
  }
};
