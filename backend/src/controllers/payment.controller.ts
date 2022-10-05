import { ORDER_STATUSES } from './../models/order.model';
import { Request, Response } from 'express';
import { Order } from '../models/order.model';

export default class PaymentController {
    async acceptPayment(req: Request, res: Response): Promise<Response> {
        try {
            const orderId = req.body.resource.custom_id;

            const order = await Order.findByPk(orderId);
            if (order && order.getDataValue('status') === ORDER_STATUSES.AWAITING_PAYMENT)
                await order.update({ status: ORDER_STATUSES.PAID });

            return res.sendStatus(200);
        } catch (error) {
            return res.sendStatus(500);
        }
    }
}
