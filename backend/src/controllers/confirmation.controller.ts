import { Order } from './../models/order.model';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function parseJwt(token: string): any {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export default class ConfirmationController {
    async confirmOrder(req: Request, res: Response): Promise<void> {
        const token: string = req.params.conftoken;

        if (token) {
            jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err) => {
                if (err) return res.redirect(`${process.env.CLIENT_LINK}?expired`);
                const orderId: number = parseJwt(token).orderId;

                try {
                    const orderConfimed = await Order.findByPk(orderId);
                    if (orderConfimed.getDataValue('statusId') === 2) res.redirect(`${process.env.CLIENT_LINK}?confirmed`);
    
                    await Order.upsert({
                        id: orderId, statusId: 2
                    });
                    res.redirect(`${process.env.CLIENT_LINK}?success`);
                } catch (e) {
                    res.redirect(`${process.env.CLIENT_LINK}?error`);
                }
            });
        } else {
            res.redirect(`${process.env.CLIENT_LINK}?error`);
        }
    }
}
