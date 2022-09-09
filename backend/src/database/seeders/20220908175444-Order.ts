import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Order',
    [
      {
        watchSize: 2,
        date: "2022-08-08",
        time: 12,
        rating: 0,
        clientId: 1,
        masterId: 1,
        cityId: 1,
        statusId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Order', null, {})
};
