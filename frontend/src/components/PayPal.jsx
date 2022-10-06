import React from 'react';
import { notify, NOTIFY_TYPES } from './Notifications';
import { PayPalButtons } from "@paypal/react-paypal-js";

const style = { "layout": "vertical", "shape": "pill", "color": "blue", "label": "pay" };

export const PayPal = ({ price, watchSize, orderId, setCheckout, onApprove }) => {
    return (
        <>
            <PayPalButtons style={style}
                createOrder={(data, actions) => {
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
                    });
                }}
                onApprove={async (data, actions) => {
                    return actions.order.capture().then(() => {
                        notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно оплачен!');
                        setCheckout(false);
                        onApprove();
                    });
                }}
                onCancel={() => {
                    notify(NOTIFY_TYPES.ERROR, 'Оплата была отменена!');
                    setCheckout(false);
                }}
                onError={(error) => {
                    notify(NOTIFY_TYPES.ERROR);
                    console.log(error);
                }
                }
            />
        </>
    )
}



