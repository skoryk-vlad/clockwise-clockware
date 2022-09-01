import jwt from 'jsonwebtoken';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
    service: "Outlook365",
    host: "smtp.office365.com",
    port: 587,
    tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
    },
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendConfMail = async (email: string, orderId: number, name: string): Promise<SentMessageInfo> => {
    const token: string = jwt.sign({ orderId }, process.env.JWT_TOKEN_KEY, { expiresIn: '3h' });

    const link: string = `${process.env.BASE_LINK}/api/confirmation/${token}`;

    const html: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
        <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
            <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
                <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                    <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
                </a>
                <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
            </div>
            <div style="padding: 10px;">
                <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
                <div style="font-size: 17px; margin-top: 15px;">Благодарим Вас за оформление заказа. Для подтверждения нажмите кнопку ниже:</div>
                <a href="${link}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
                border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px;">
                    Подтвердить
                </a>
            </div>
        </div>
        </div>`;

    return await transporter.sendMail({
        from: '"Clockwise Clockware" <clockwise-clockware@outlook.com>',
        to: email,
        subject: 'Confirmation',
        html: html
    });
}

export { sendConfMail };