import { QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Master',
    [
      {
        id: 1,
        name: 'Владислав',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Арсений',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Master', null, {})
};
