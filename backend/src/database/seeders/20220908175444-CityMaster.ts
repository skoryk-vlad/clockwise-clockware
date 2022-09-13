import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'CityMaster',
    [
      {
        id: 1,
        masterId: 1,
        cityId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        masterId: 2,
        cityId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('CityMaster', null, {})
};
