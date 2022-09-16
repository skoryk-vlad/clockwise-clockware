import { Master, MASTER_STATUSES } from './../models/master.model';
import { Client, CLIENT_STATUSES } from './../models/client.model';
import { ROLES, User } from './../models/user.model';
import { Order, ORDER_STATUSES } from './../models/order.model';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

export default class ConfirmationController {
    async confirmOrder(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationToken;

        if (uuidValidate(confirmationToken)) {
            try {
                const order = await Order.findOne({ where: { confirmationToken } });
                if (!order) return res.redirect(`${process.env.CLIENT_LINK}?error`);
                if (order.getDataValue('status') === ORDER_STATUSES.CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
                await order.update({ status: ORDER_STATUSES.CONFIRMED });
                return res.redirect(`${process.env.CLIENT_LINK}?success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}?error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
    async confirmUser(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationToken;

        if (uuidValidate(confirmationToken)) {
            try {
                const user = await User.findOne({ where: { confirmationToken } });
                if (!user) return res.redirect(`${process.env.CLIENT_LINK}?error`);

                if (user.getDataValue('role') === ROLES.CLIENT) {
                    const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                    if (client) {
                        if (client.getDataValue('status') === CLIENT_STATUSES.CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
                        await client.update({ status: CLIENT_STATUSES.CONFIRMED });
                    }
                }
                if (user.getDataValue('role') === ROLES.MASTER) {
                    const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                    if (master) {
                        if (master.getDataValue('status') === MASTER_STATUSES.CONFIRMED || master.getDataValue('status') === MASTER_STATUSES.APPROVED) return res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
                        await master.update({ status: MASTER_STATUSES.CONFIRMED });
                    }
                }

                return res.redirect(`${process.env.CLIENT_LINK}?success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}?error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}
