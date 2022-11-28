module.exports = {
  local: {
    url: "postgres://postgres:root@localhost:5432/clockware",
    dialect: 'postgres',
  },
  test: {
    url: process.env.DB_CONNECT,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DB_CONNECT,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    },
    dialect: 'postgres',
  }
}
