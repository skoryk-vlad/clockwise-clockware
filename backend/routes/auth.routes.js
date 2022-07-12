const Router = require('express');
require('dotenv').config({ path: `.env.local` });
const AuthController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

const router = new Router();

const authJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_TOKEN_KEY, (err) => {
            if (err) {
                return res.status(401).json({auth: false});
            }

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post('/auth', AuthController.login);
router.get('/admin', authJWT, AuthController.check);

module.exports = {router, authJWT};