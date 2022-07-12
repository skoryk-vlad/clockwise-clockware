const nodemailer = require('nodemailer')

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

const sendConfMail = async (email, link) => {
    return await transporter.sendMail({
        from: '"Clockwise Clockware" <clockwise-clockware@outlook.com>',
        to: email,
        subject: 'Confirmation',
        html:
            `Для подтверждения заказа перейдите по ссылке ${link}.`,
    })
}

module.exports = sendConfMail;