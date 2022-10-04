import { sequelize } from './../sequelize';
import { Master } from './../models/master.model';
import { sendReminderMail } from '../mailer';
import { Order } from '../models/order.model';
import cron from 'node-cron';
import { formatISO, getHours } from 'date-fns';
import { User } from '../models/user.model';
import { Client } from '../models/client.model';

export const sendReminderMailTask = async () => {
    cron.schedule(`0 0 9-17 * * *`, async () => {
        try {
            const orders = await Order.findAll({
                attributes: { include: [[sequelize.col('Master.name'), 'master'], [sequelize.col('Master.User.email'), 'email'], [sequelize.col('Client.name'), 'client']] },
                include: [{ model: Master, attributes: [], include: [{ model: User, attributes: [] }] },
                { model: Client, attributes: [] }],
                where: {
                    date: formatISO(new Date(), { representation: 'date' }),
                    time: getHours(new Date()) + 1
                }
            })
            orders.forEach(async (order) => {
                const orderAttributes = JSON.parse(JSON.stringify(order));
                await sendReminderMail(orderAttributes.email, orderAttributes.master, order.get(), orderAttributes.client);
            });
        } catch (error) {
            console.log(error);
        }
    });
}
