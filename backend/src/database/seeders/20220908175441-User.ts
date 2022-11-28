import { encryptPassword } from './../../password';
import { QueryInterface } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

enum ROLES {
  ADMIN = 'admin',
  MASTER = 'master',
  CLIENT = 'client'
}

module.exports = {
  up: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkInsert(
    'User',
    [
      {
        id: 1,
        email: encryptPassword('passwordsecret'),
        password: 'passwordsecret',
        role: ROLES.ADMIN,
        confirmationToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        email: 'master1@example.com',
        password: encryptPassword('masterpassword'),
        role: ROLES.MASTER,
        confirmationToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        email: 'master2@example.com',
        password: encryptPassword('masterpassword'),
        role: ROLES.MASTER,
        confirmationToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        email: 'client1@example.com',
        password: encryptPassword('clientpassword'),
        role: ROLES.CLIENT,
        confirmationToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        email: 'client2@example.com',
        password: encryptPassword('clientpassword'),
        role: ROLES.CLIENT,
        confirmationToken: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface: QueryInterface): Promise<number | object> => queryInterface.bulkDelete('User', null, {})
};
