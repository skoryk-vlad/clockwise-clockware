const db = require('../db');
const jwt = require('jsonwebtoken');

const authInfo = {
    login: 'admin@example.com',
    password: 'passwordsecret'
}
const tokenKey = 'gknfg5sd7-vgf5tva37sd-g9kvop12-ds';

class AuthController {
    async login(req, res) {
        const { login, password } = req.body.params;
        if (login === authInfo.login && password === authInfo.password) {
            return res.json({
                token: jwt.sign({ user: 'admin', auth: true }, tokenKey, {expiresIn: '1h'})
            })
        }
    
        return res.status(404).json({ message: 'Username or password incorrect' })
    }
    async check(req, res) {
        res.json({auth: true});
    }
}

module.exports = new AuthController();
