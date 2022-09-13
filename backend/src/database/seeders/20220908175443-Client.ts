import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Client',
    [
      {
        id: 1,
        name: 'Владислав',
        email: 'vladyslav123@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Арсений',
        email: 'arseniy456@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Client', null, {})
};
