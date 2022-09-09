import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Master',
    [
      {
        name: 'Владислав',
        cities: '{1,2}',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Арсений',
        cities: '{2}',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Master', null, {})
};
