import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    return Promise.all([
      await queryInterface.createTable(
        'MapArea',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          area: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          cityId: {
            type: Sequelize.INTEGER,
            references: {
              model: 'City',
              key: 'id',
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
        }
      ),
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return Promise.all([
      await queryInterface.dropTable('MapArea')
    ]);
  }
};
