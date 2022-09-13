import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Master', 'cities'),
      await queryInterface.createTable('CityMaster', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        cityId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'City',
            key: 'id'
          }
        },
        masterId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Master',
            key: 'id'
          }
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
      await queryInterface.addConstraint('CityMaster', {
        fields: ['cityId', 'masterId'],
        type: 'unique',
        name: 'CityMaster_ukey'
      })
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.addColumn(
        'Master',
        'cities',
        {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          allowNull: false
        }
      ),
      await queryInterface.dropTable('CityMaster')
    ]);
  }
};
