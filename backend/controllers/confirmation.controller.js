const db = require('../db');
const jwt = require('jsonwebtoken');

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

class ConfirmationController {
    async confirmOrder(req, res) {
        const token = req.params.conftoken;

        if (token) {
            jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err) => {
                if (err) {
                    return res.redirect(`${process.env.CLIENT_LINK}?error`);
                }
                
                const orderId = parseJwt(token).orderId;
                await db.query('UPDATE orders set status_id = 2 where id = $1 RETURNING *', [orderId]);

                res.redirect(`${process.env.CLIENT_LINK}?success`);
            });
        } else {
            res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}

module.exports = new ConfirmationController();
