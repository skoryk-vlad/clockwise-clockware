import React from 'react';
import { notify, NOTIFY_TYPES } from './Notifications';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslation } from 'react-i18next';

const style = { "layout": "vertical", "shape": "pill", "color": "blue", "label": "pay" };

export const PayPal = ({ price, watchSize, orderId, setCheckout, onApprove }) => {
    const { t } = useTranslation();

    return (
        <>
            <PayPalButtons style={style}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                custom_id: orderId,
                                description: `${t('paypal.description')}: ${watchSize}`,
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
                        notify(NOTIFY_TYPES.SUCCESS, t('paypal.paymentSuccess'));
                        setCheckout(false);
                        onApprove();
                    });
                }}
                onCancel={() => {
                    notify(NOTIFY_TYPES.ERROR, t('paypal.paymentCancel'));
                    setCheckout(false);
                }}
                onError={(error) => {
                    notify(NOTIFY_TYPES.ERROR);
                }
                }
            />
        </>
    )
}



