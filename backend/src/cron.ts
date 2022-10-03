import { sendReminderMail } from './mailer';
import { OrderAttributes } from './models/order.model';
import cron from 'node-cron';

export const scheduleReminderMail = (email: string, name: string, order: OrderAttributes, client: string) => {
    const date = order.date.split('-');
    const hour = order.time - 1;

    cron.schedule(`0 ${hour} ${date[2]} ${date[1]} *`, async () => {
        try {
            await sendReminderMail(email, name, order, client);
        } catch (error) {
            console.log(error);
        }
    });
}
