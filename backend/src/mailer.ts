import { OrderAttributes, WatchSizesTranslate } from './models/order.model';
import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';

const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendConfirmationOrderMail = async (email: string, name: string, order: OrderAttributes, master: string): Promise<SentMessageInfo> => {
    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
        <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
            <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
                <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                    <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
                </a>
                <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
            </div>
            <div style="padding: 10px;">
                <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
                <div style="font-size: 17px; margin-top: 15px;">Благодарим Вас за оформление заказа!</div>
                <div style="font-size: 17px; margin-top: 10px;">Детали:</div>
                <div style="font-size: 14px; margin-top: 8px;"><span style="font-weight: bold;">Дата и время</span>: ${order.date} ${order.time}:00 - ${order.endTime}:00</div>
                <div style="font-size: 14px; margin-top: 8px;"><span style="font-weight: bold;">Размер часов</span>: ${WatchSizesTranslate[order.watchSize]}</div>
                <div style="font-size: 14px; margin-top: 8px;"><span style="font-weight: bold;">Мастер</span>: ${master}</div>
                <div style="font-size: 14px; margin-top: 8px;"><span style="font-weight: bold;">Цена</span>: ${order.price} грн</div>

            </div>
        </div>
        </div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Заказ успешно получен - Clockwise Clockware',
        html: htmlMessage
    });
};

export const sendConfirmationUserMail = async (email: string, confirmationToken: string, name: string): Promise<SentMessageInfo> => {
    const confirmationLink: string = `${process.env.BASE_LINK}/api/confirm/user/${confirmationToken}`;

    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
    <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
        <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
            <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
            </a>
            <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
        </div>
        <div style="padding: 10px;">
            <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
            <div style="font-size: 17px; margin-top: 15px;"> Благодарим Вас за создание аккаунта. Для подтверждения нажмите кнопку ниже: </div>
            <a href="${confirmationLink}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
            border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px; ">
                Подтвердить
            </a>
        </div>
    </div>
</div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Подтверждение аккаунта - Clockwise Clockware',
        html: htmlMessage
    });
};

export const sendUserLoginInfoMail = async (email: string, password: string, name: string): Promise<SentMessageInfo> => {
    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
    <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
        <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
            <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
            </a>
            <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
        </div>
        <div style="padding: 10px;">
            <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
            <div style="font-size: 17px; margin-top: 15px;">Поздравляем! Ваш аккаунт создан.</div>
            <div style="font-size: 18px; margin-top: 20px; font-weight: bold;">Данные для входа:</div>
            <div style="font-size: 17px; margin-top: 10px;">Логин: <span style="font-weight: bold">${email}</span></div>
            <div style="font-size: 17px; margin-top: 5px;">Пароль: <span style="font-weight: bold;">${password}</span></div>
            <a href="${process.env.CLIENT_LINK}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
            border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px; ">
                Перейти на сайт
            </a>
        </div>
    </div>
</div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Регистрация прошла успешно - Clockwise Clockware',
        html: htmlMessage
    });
};

export const sendMasterApprovedMail = async (email: string, name: string): Promise<SentMessageInfo> => {
    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
    <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
        <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
            <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
            </a>
            <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
        </div>
        <div style="padding: 10px;">
            <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
            <div style="font-size: 17px; margin-top: 15px;">Поздравляем! Ваш аккаунт одобрен. Теперь Вы можете авторизоваться в своем личном кабинете и приступить к выполнению заказов.</div>
            <a href="${process.env.CLIENT_LINK}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
            border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px; ">
                Перейти на сайт
            </a>
        </div>
    </div>
</div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Одобрение аккаунта - Clockwise Clockware',
        html: htmlMessage
    });
};

export const sendResetedPasswordMail = async (email: string, password: string, name: string): Promise<SentMessageInfo> => {
    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
    <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
        <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
            <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
            </a>
            <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
        </div>
        <div style="padding: 10px;">
            <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
            <div style="font-size: 17px; margin-top: 15px;">Пароль успешно сброшен. Новые данные для входа:</div>
            <div style="font-size: 17px; margin-top: 10px;">Логин: <span style="font-weight: bold">${email}</span></div>
            <div style="font-size: 17px; margin-top: 5px;">Пароль: <span style="font-weight: bold;">${password}</span></div>
            <a href="${process.env.CLIENT_LINK}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
            border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px; ">
                Перейти на сайт
            </a>
        </div>
    </div>
</div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Сброс пароля - Clockwise Clockware',
        html: htmlMessage
    });
};

export const sendOrderCompletedMail = async (email: string, name: string, reviewToken: string): Promise<SentMessageInfo> => {
    const reviewLink: string = `${process.env.BASE_LINK}/api/order-review/${reviewToken}`;
    
    const htmlMessage: string = `<div style="background-color: #f2f2f2; padding: 10px; width: 100%; color: #000">
    <div style="max-width: 600px; background-color: #fff; margin: auto; border: 1px solid lightgray; border-radius: 2px;">
        <div style="overflow: hidden; height: 40px; display: flex; align-items: center; padding: 10px;">
            <a href="${process.env.CLIENT_LINK}" style="overflow: hidden; width: 40px; height: 40px; cursor: pointer;">
                <img src="https://clockwiseintership.netlify.app/images/logo.png" style="width: 100%; height: 100%;" alt="Clockwise Clockware" />
            </a>
            <a href="${process.env.CLIENT_LINK}" style="margin: 0px 0px 0px 10px; color: #000; cursor: pointer; text-decoration: none; font-size: 20px; line-height: 20px;">Clockwise <br /> Clockware</a>
        </div>
        <div style="padding: 10px;">
            <div style="font-weight: bold; text-align: center; font-size: 22px; margin-top: 10px;">Здравствуйте, ${name}!</div>
            <div style="font-size: 17px; margin-top: 15px;">Поздравляем! Мастер отметил заказ выполненным. Теперь Вы можете оценить его выполнение и оставить отзыв:</div>
            <a href="${reviewLink}" style="padding: 10px 20px; color: #fff; font-size: 20px; background-color: #6F2CFF; text-decoration: none;
            border: 1px solid #6F2CFF; cursor: pointer; border-radius: 20px; display: inline-block; margin-top: 10px; ">
                Оставить отзыв
            </a>
        </div>
    </div>
</div>`;

    return await transporter.sendMail({
        from: `"Clockwise Clockware" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Заказ успешно выполнен - Clockwise Clockware',
        html: htmlMessage
    });
};
