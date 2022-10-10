import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.addColumn(
        'Order',
        'imagesLinks',
        {
          type: Sequelize.ARRAY(Sequelize.STRING)
        }
      )
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.removeColumn('Order', 'imagesLinks')
    ]);
  }
};
