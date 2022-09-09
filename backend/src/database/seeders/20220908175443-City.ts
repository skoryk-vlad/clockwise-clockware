import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'City',
    [
      {
        name: 'Днепр',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Ужгород',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('City', null, {})
};
