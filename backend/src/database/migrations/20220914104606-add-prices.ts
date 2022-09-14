import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'price',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      await queryInterface.addColumn(
        'City',
        'price',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'price'),
      await queryInterface.removeColumn('City', 'price')
    ]);
  }
};
