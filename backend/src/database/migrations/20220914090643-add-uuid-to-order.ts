import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void> {
    return await queryInterface.addColumn(
      'Order',
      'uuid',
      {
        type: Sequelize.UUID,
        allowNull: false
      }
    )
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    return await queryInterface.removeColumn('Order', 'uuid');
  }
};
