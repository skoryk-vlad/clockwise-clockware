# Website for Clockwise Clockware

This is the website for the fictional company Clockwise Clockware. It allows customers to place an order for the repair of grandfather clocks, and it is convenient for the site owner to manage it. It has a regular page for users with a checkout form. The site also has a protected admin section. It allows you to manage the cities in which he works, masters, clients and orders. You can add, change or remove them.

The working site can be viewed at the link: [clockwiseintership.netlify.app](https://clockwiseintership.netlify.app/)

## Technologies

Project created with:
- React.js version: 18.1.0
- Express.js version: 4.18.1
- PostgreSQL version: 14

## Launch

To run this project, install it locally and prepare such .env.local file into backend directory:

```javascript
DB_CONNECT={ "connectionString": "postgres://login:password@host:port/database" }
JWT_TOKEN_KEY="some_jwt_token_key"
AUTH={"login": "admin@example.com", "password": "passwordsecret"}
MAIL_USER="mail_name@mail.com"
MAIL_PASS="mailpass"
BASE_LINK="http://localhost:3001"
CLIENT_LINK="http://localhost:3000"
```

And then:
```javascript
// Launch frontend part
$ cd .\frontend\
$ npm install
$ npm start

// Launch backend part
$ cd .\backend\
$ npm install
$ npm run serve
```