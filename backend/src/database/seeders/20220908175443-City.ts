import { QueryInterface } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'City',
    [
      {
        id: 1,
        name: 'Днепр',
        price: 75,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Ужгород',
        price: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('City', null, {})
};
