import { Order, STATUSES } from './../models/order.model';
import { Request, Response } from 'express';
import { validate as uuidValidate } from 'uuid';

export default class ConfirmationController {
    async confirmOrder(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationToken;

        if (uuidValidate(confirmationToken)) {
            try {
                const order = await Order.findOne({ where: { confirmationToken } });
                if (!order) return res.redirect(`${process.env.CLIENT_LINK}?error`);
                if (order.getDataValue('status') === STATUSES.CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
                await order.update({ status: STATUSES.CONFIRMED });
                return res.redirect(`${process.env.CLIENT_LINK}?success`);
            } catch (error) {
                return res.redirect(`${process.env.CLIENT_LINK}?error`);
            }
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}
