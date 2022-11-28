import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

enum STATUSES {
  AWAITING_PAYMENT = 'awaiting payment',
  PAID = 'paid',
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
        endTime: 13,
        rating: 0,
        clientId: 1,
        masterId: 1,
        cityId: 1,
        status: STATUSES.AWAITING_PAYMENT,
        reviewToken: uuidv4(),
        price: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        watchSize: WATCH_SIZES.BIG,
        date: "2022-08-21",
        time: 14,
        endTime: 17,
        rating: 0,
        clientId: 2,
        masterId: 2,
        cityId: 2,
        status: STATUSES.PAID,
        reviewToken: uuidv4(),
        price: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Order', null, {})
};
