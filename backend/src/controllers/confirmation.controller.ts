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
                if (!order) return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
                if (order.getDataValue('status') !== ORDER_STATUSES.AWAITING_CONFIRMATION) return res.redirect(`${process.env.CLIENT_LINK}/message/already-confirmed`);
                await order.update({ status: ORDER_STATUSES.CONFIRMED });
                const client = await Client.findByPk(order.getDataValue('clientId'));
                if (client.getDataValue('status') === CLIENT_STATUSES.NOT_CONFIRMED) await client.update({ status: CLIENT_STATUSES.CONFIRMED });
                return res.redirect(`${process.env.CLIENT_LINK}/message/success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
        }
    }
    async confirmUser(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationToken;

        if (uuidValidate(confirmationToken)) {
            try {
                const user = await User.findOne({ where: { confirmationToken } });
                if (!user) return res.redirect(`${process.env.CLIENT_LINK}/message/error`);

                if (user.getDataValue('role') === ROLES.CLIENT) {
                    const client = await Client.findOne({ where: { userId: user.getDataValue('id') } });
                    if (client) {
                        if (client.getDataValue('status') !== CLIENT_STATUSES.NOT_CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}/message/already-confirmed`);
                        await client.update({ status: CLIENT_STATUSES.CONFIRMED });
                    }
                } else if (user.getDataValue('role') === ROLES.MASTER) {
                    const master = await Master.findOne({ where: { userId: user.getDataValue('id') } });
                    if (master) {
                        if (master.getDataValue('status') !== MASTER_STATUSES.NOT_CONFIRMED || master.getDataValue('status') === MASTER_STATUSES.APPROVED) return res.redirect(`${process.env.CLIENT_LINK}/message/already-confirmed`);
                        await master.update({ status: MASTER_STATUSES.CONFIRMED });
                    }
                }

                return res.redirect(`${process.env.CLIENT_LINK}/message/success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
        }
    }
}
