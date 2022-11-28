import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'address',
        {
          type: Sequelize.STRING
        }
      ),
      await queryInterface.addColumn(
        'Order',
        'lngLat',
        {
          type: Sequelize.ARRAY(Sequelize.DOUBLE)
        }
      ),
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'address'),
      await queryInterface.removeColumn('Order', 'lngLat')
    ]);
  }
};
