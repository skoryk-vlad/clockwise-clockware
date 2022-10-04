import { CreatePaymentSchema } from './../validationSchemas/payment.schema';
import { ORDER_STATUSES } from './../models/order.model';
import { Request, Response } from 'express';
import paypal, { Payment } from 'paypal-rest-sdk';
import { Order } from '../models/order.model';

paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_SECRET
});

export default class PaymentController {
    async createPayment(req: Request, res: Response): Promise<any> {
        try {
            const { price, watchSize, orderId } = CreatePaymentSchema.parse(req.body);

            const order = await Order.findByPk(orderId);
            if (order.getDataValue('status') !== ORDER_STATUSES.AWAITING_PAYMENT) return res.redirect(`${process.env.CLIENT_LINK}/message/error`);

            const create_payment_json: Payment = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": `${process.env.BASE_LINK}/api/pay/success`,
                    "cancel_url": `${process.env.BASE_LINK}/api/pay/cancel`
                },
                "transactions": [{
                    "item_list": {
                        "items": [{
                            "name": "Ремонт напольных часов",
                            "price": price.toString(),
                            "currency": "USD",
                            "description": watchSize,
                            "quantity": 1
                        }]
                    },
                    "amount": {
                        "currency": "USD",
                        "total": price.toString()
                    },
                    "description": "Ремонт напольных часов"
                }]
            };

            paypal.payment.create(create_payment_json, async (error, payment) => {
                if (error) {
                    return res.sendStatus(500);
                } else {
                    await order.update({ paymentToken: payment.id });

                    for (let i = 0; i < payment.links.length; i++) {
                        if (payment.links[i].rel === 'approval_url') {
                            return res.json({ forwardLink: payment.links[i].href });
                        }
                    }
                }
            });
        } catch (error) {
            return res.sendStatus(500);
        }
    }

    async successPayment(req: Request, res: Response): Promise<void> {
        try {
            const payerId = String(req.query.PayerID);
            const paymentId = String(req.query.paymentId);
            const order = await Order.findOne({ where: { paymentToken: paymentId } });

            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": order.getDataValue('price')
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
                if (error) {
                    return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
                } else {
                    await order.update({ status: ORDER_STATUSES.PAID });
                    return res.redirect(`${process.env.CLIENT_LINK}/message/payment/success`);
                }
            });
        } catch (error) {
            return res.redirect(`${process.env.CLIENT_LINK}/message/error`);
        }
    }

    async cancelPayment(req: Request, res: Response): Promise<void> {
        res.redirect(`${process.env.CLIENT_LINK}/message/error`);
    }
}
