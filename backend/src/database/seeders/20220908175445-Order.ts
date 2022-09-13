import { QueryInterface } from 'sequelize';
'use strict';

enum STATUSES {
  AWAITING_CONFIRMATION = 'awaiting confirmation',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}
enum WATCH_SIZES {
  SMALL = 'small',
  MEDIUM = 'medium',
  BIG = 'big'
}

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Order',
    [
      {
        id: 1,
        watchSize: WATCH_SIZES.SMALL,
        date: "2022-08-20",
        time: 12,
        endTime: 12 + Object.values(WATCH_SIZES).indexOf(WATCH_SIZES.SMALL),
        rating: 0,
        clientId: 1,
        masterId: 1,
        cityId: 1,
        status: STATUSES.AWAITING_CONFIRMATION,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        watchSize: WATCH_SIZES.BIG,
        date: "2022-08-21",
        time: 14,
        endTime: 14 + Object.values(WATCH_SIZES).indexOf(WATCH_SIZES.BIG),
        rating: 0,
        clientId: 2,
        masterId: 2,
        cityId: 2,
        status: STATUSES.AWAITING_CONFIRMATION,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Order', null, {})
};
