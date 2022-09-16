import { QueryInterface } from 'sequelize';

enum CLIENT_STATUSES {
  NOT_CONFIRMED = 'not confirmed',
  CONFIRMED = 'confirmed'
}
enum MASTER_STATUSES {
  NOT_CONFIRMED = 'not confirmed',
  CONFIRMED = 'confirmed',
  APPROVED = 'approved'
}

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.addColumn(
        'Master',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(MASTER_STATUSES)),
          allowNull: false,
          defaultValue: MASTER_STATUSES.NOT_CONFIRMED
        }
      ),
      await queryInterface.addColumn(
        'Client',
        'status',
        {
          type: Sequelize.ENUM(...Object.values(CLIENT_STATUSES)),
          allowNull: false,
          defaultValue: CLIENT_STATUSES.NOT_CONFIRMED
        }
      )
    ]);
  },

  async down(queryInterface: QueryInterface, Sequelize: any): Promise<void[]> {
    return Promise.all([
      await queryInterface.removeColumn('Client', 'status'),
      await queryInterface.removeColumn('Master', 'status')
    ]);
  }
};
