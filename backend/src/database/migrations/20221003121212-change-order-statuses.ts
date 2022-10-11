import { QueryInterface } from 'sequelize';

enum ORDER_STATUSES {
  AWAITING_PAYMENT = 'awaiting payment',
  PAID = 'paid',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
enum OLD_ORDER_STATUSES {
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
      await queryInterface.sequelize.query('drop type "enum_Order_status";'),
      await queryInterface.sequelize.query(`update "Order" set status='awaiting payment' where status='confirmed';`),
      await queryInterface.sequelize.query('alter table "Order" alter status drop default;'),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(ORDER_STATUSES)),
          allowNull: false
        }
      ),
      await queryInterface.addColumn(
        'Order',
        'paypalInvoiceId',
        {
          type: Sequelize.STRING
        }
      )
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'paypalInvoiceId'),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.TEXT,
        },
      ),
      await queryInterface.sequelize.query('drop type "enum_Order_status";'),
      await queryInterface.sequelize.query(`update "Order" set status='confirmed' where status='awaiting payment';`),
      await queryInterface.changeColumn(
        'Order',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(OLD_ORDER_STATUSES)),
          allowNull: false
        }
      )
    ]);
  }
};
