const jwt = require('jsonwebtoken');

class AuthController {
    async login(req, res) {
        const { login, password } = req.body;
        const authInfo = JSON.parse(process.env.AUTH);
        if (login === authInfo.login && password === authInfo.password) {
            return res.json({
                token: jwt.sign({ user: 'admin' }, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'})
            })
        }
    
        return res.status(404).json({ message: 'Username or password incorrect' })
    }
    async check(req, res) {
        res.json({auth: true});
    }
}

module.exports = new AuthController();
