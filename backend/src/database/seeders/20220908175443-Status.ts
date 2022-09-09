import { QueryInterface } from 'sequelize';
'use strict';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'Status',
    [
      {
        name: 'Ожидает подтверждения',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Подтвержден',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Выполнен',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Отменен',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('Status', null, {})
};
