import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.changeColumn(
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
      await queryInterface.changeColumn(
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
      await queryInterface.changeColumn(
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
      await queryInterface.changeColumn(
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
      await queryInterface.removeConstraint('Order', 'Order_cityId_fkey'),
      await queryInterface.removeConstraint('Order', 'Order_clientId_fkey'),
      await queryInterface.removeConstraint('Order', 'Order_masterId_fkey'),
      await queryInterface.removeConstraint('Order', 'Order_statusId_fkey')
    ]);
  }
};
