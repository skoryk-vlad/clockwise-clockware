import { QueryInterface } from 'sequelize';

enum ROLES {
  ADMIN = 'admin',
  MASTER = 'master',
  CLIENT = 'client'
}

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.createTable('User', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING
        },
        role: {
          type: Sequelize.ENUM(...Object.values(ROLES)),
          allowNull: false
        },
        confirmationToken: {
          type: Sequelize.UUID,
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
      await queryInterface.addColumn(
        'Master',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      await queryInterface.addColumn(
        'Client',
        'userId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        }
      ),
      await queryInterface.removeColumn('Client', 'email'),
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.addColumn(
        'Client',
        'email',
        {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      ),
      await queryInterface.removeColumn('Client', 'userId'),
      await queryInterface.removeColumn('Master', 'userId'),
      await queryInterface.dropTable('User')
    ]);
  }
};
