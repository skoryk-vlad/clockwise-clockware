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
                where: {
                    date: formatISO(new Date(), { representation: 'date' }),
                    time: getHours(new Date()) + 1
                }
            })
            if (orders.length > 0) {
                orders.forEach(async (order) => {
                    const master = await Master.findByPk(order.getDataValue('masterId'));
                    const user = await User.findByPk(master.getDataValue('userId'));
                    const client = await Client.findByPk(order.getDataValue('clientId'));
                    await sendReminderMail(user.getDataValue('email'), master.getDataValue('name'), order.get(), client.getDataValue('name'));
                });
            }
        } catch (error) {
            console.log(error);
        }
    });
}
