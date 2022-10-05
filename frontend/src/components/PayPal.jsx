import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { notify, NOTIFY_TYPES } from './Notifications';

export const PayPal = ({ price, watchSize, orderId, setCheckout, onApprove }) => {
    const paypal = useRef();

    useEffect(() => {
        window.paypal.Buttons({
            style: {
                shape: 'pill',
                color: 'blue',
                layout: 'vertical',
                label: 'pay'
            },
            createOrder: (data, actions) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            custom_id: orderId,
                            description: `Ремонт напольных часов: ${watchSize}`,
                            amount: {
                                value: price,
                                currency_code: "USD"
                            }
                        }
                    ]
                })
            },
            onApprove: async (data, actions) => {
                return actions.order.capture().then(() => {
                    notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно оплачен!');
                    setCheckout(false);
                    onApprove();
                });
            },
            onError: (error) => {
                notify(NOTIFY_TYPES.ERROR);
                console.log(error);
            },
            onCancel: () => {
                notify(NOTIFY_TYPES.ERROR, 'Оплата была отменена!');
                setCheckout(false);
            }
        }).render(paypal.current);
    }, []);

    return (
        <>
            <div ref={paypal} className='paypal'></div>
        </>
    )
}



