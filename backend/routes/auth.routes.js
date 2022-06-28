const Router = require('express');
const AuthController = require('../controllers/auth.controller');
const jwt = require('jsonwebtoken');

const router = new Router();

const tokenKey = 'gknfg5sd7-vgf5tva37sd-g9kvop12-ds';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, tokenKey, (err, user) => {
            if (err) {
                return res.json({auth: false});
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.post('/auth', AuthController.login);
router.get('/admin', authenticateJWT, AuthController.check);

module.exports = router;