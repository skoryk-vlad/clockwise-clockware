import { JWTConfirmationPayload } from './../types';
import { Order, STATUSES } from './../models/order.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const jwtConfirmationPayload = (token: string): JWTConfirmationPayload => JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());

export default class ConfirmationController {
    async confirmOrder(req: Request, res: Response): Promise<void> {
        const confirmationToken: string = req.params.confirmationtoken;

        if (confirmationToken) {

            jwt.verify(confirmationToken, process.env.JWT_TOKEN_KEY, async (error) => {
                if (error) return res.redirect(`${process.env.CLIENT_LINK}?expired`);
                const orderId: number = jwtConfirmationPayload(confirmationToken).orderId;

                try {
                    const order = await Order.findByPk(orderId);
                    if (!order) return res.redirect(`${process.env.CLIENT_LINK}?error`);
                    if (order.getDataValue('status') === STATUSES.CONFIRMED) return res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
                    await order.update({ status: STATUSES.CONFIRMED });
                    return res.redirect(`${process.env.CLIENT_LINK}?success`);
                } catch (error) {
                    return res.redirect(`${process.env.CLIENT_LINK}?error`);
                }
            });
        } else {
            return res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}
