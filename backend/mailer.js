const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: "587",
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendConfMail = async (email, orderId) => {
    const token = jwt.sign({ orderId }, process.env.JWT_TOKEN_KEY, {expiresIn: '1h'});

    const link = `${process.env.BASE_LINK}/confirmation/${token}`;

    return await transporter.sendMail({
        from: '"Clockwise Clockware" <clockwise-clockware@outlook.com>',
        to: email,
        subject: 'Confirmation',
        html:
            `Для подтверждения заказа перейдите по ссылке ${link}.`,
    })
}

module.exports = sendConfMail;