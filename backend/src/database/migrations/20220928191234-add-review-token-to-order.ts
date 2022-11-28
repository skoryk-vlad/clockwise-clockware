import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'reviewToken',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: uuidv4()
        }
      ),
      await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'),
      await queryInterface.sequelize.query('update "Order" set "reviewToken" = uuid_generate_v4();'),
      await queryInterface.addColumn(
        'Order',
        'review',
        {
          type: Sequelize.TEXT
        }
      )
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'reviewToken'),
      await queryInterface.removeColumn('Order', 'review')
    ]);
  }
};
