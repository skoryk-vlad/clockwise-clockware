import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.createTable('City', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
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
      await queryInterface.createTable('Client', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
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
      await queryInterface.createTable('Master', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        cities: {
          type: Sequelize.ARRAY(Sequelize.INTEGER),
          allowNull: false
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
      await queryInterface.createTable('Order', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        watchSize: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        date: {
          type: Sequelize.STRING,
          allowNull: false
        },
        time: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        rating: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        cityId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        clientId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        masterId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        statusId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1
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
      await queryInterface.createTable('Status', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
    ]);
  },
  async down(queryInterface: QueryInterface): Promise<void[]> {
    return Promise.all([
      await queryInterface.dropTable('Order'),
      await queryInterface.dropTable('Master'),
      await queryInterface.dropTable('Client'),
      await queryInterface.dropTable('Status'),
      await queryInterface.dropTable('City'),
    ]);
  }
};