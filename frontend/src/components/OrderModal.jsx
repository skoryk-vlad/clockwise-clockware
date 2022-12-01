import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService, UserService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, ROLES } from '../constants';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { jwtPayload } from './PrivateRoute';
import { notify, NOTIFY_TYPES } from './Notifications';
import { MasterChoice } from './MasterChoice/MasterChoice';
import { OrderButton } from './OrderButton/OrderButton';
import { PayPal } from './PayPal';
import { MyModal } from './modal/MyModal';
import { useTranslation } from 'react-i18next';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.AWAITING_PAYMENT,
    images: [],
    isMasterToHouse: false,
    address: '',
    lngLat: [],
};

export const OrderModal = ({ isOrderModalOpened, setIsOrderModalOpened, login, register }) => {
    const { t } = useTranslation();

    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);

    const [isOrderDetailsOpened, setIsOrderDetailsOpened] = useState(false);
    const [orderReturned, setOrderReturned] = useState({});

    const [isConfirmationModalOpened, setIsConfirmationModalOpened] = useState(false);
    const [confirmationModalInfo, setConfirmationModalInfo] = useState({
        text: '',
        onAccept: () => { },
        onReject: () => { }
    });

    const [checkout, setCheckout] = useState(false);
    const [orderPaid, setOrderPaid] = useState(false);

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities.rows.filter(city => city.Masters.length > 0));
    });
    useEffect(() => {
        fetchCities();
    }, []);
    useEffect(() => {
        if (isOrderModalOpened === false) refusePayment();
    }, [isOrderModalOpened]);

    const addOrder = async (chosenMaster) => {
        const formData = new FormData();
        Array.from(order.images).map(image => formData.append(`images`, image));
        Object.entries(order).forEach(([key, value]) => formData.append(key, value));
        formData.append("masterId", chosenMaster);

        const orderReturned = await OrderService.addOrder(formData);
        setOrderReturned(orderReturned);
        setIsFormOpened(true);
        notify(NOTIFY_TYPES.SUCCESS, t('notifications.orderReceived'));
        setOrder(defaultOrder);
        setIsOrderDetailsOpened(true);
    }
    const checkUserExist = async (order) => {
        setOrder(order);
        const client = await UserService.checkUserByEmail(order.email);
        if (!client) {
            setIsConfirmationModalOpened(true);
            setConfirmationModalInfo({
                text: t('notifications.wantSignUp'),
                onAccept: () => registerClient(),
                onReject: () => findMasters(order)
            });
        } else {
            if (jwtPayload(localStorage.getItem('token'))?.role === ROLES.CLIENT && jwtPayload(localStorage.getItem('token'))?.id === client.id) {
                findMasters(order);
            } else {
                if (order.name !== client.name) {
                    setIsConfirmationModalOpened(true);
                    setConfirmationModalInfo({
                        text: t('notifications.wantChangeName', { clientName: client.name, orderName: order.name }),
                        onAccept: () => { setIsConfirmationModalOpened(false); login(); },
                        onReject: () => { setOrder({ ...order, name: client.name }); setIsConfirmationModalOpened(false); login(); }
                    });
                } else {
                    login();
                }
                notify(NOTIFY_TYPES.ERROR, t('notifications.loginFirst'));
            }
        }
    }

    const registerClient = async () => {
        setIsConfirmationModalOpened(false);
        register();
    }
    const findMasters = async (order) => {
        const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
        setFreeMasters(freeMasters.map(master => !master.rating ? ({ ...master, rating: '-' }) : master));
        setIsFormOpened(false);
        setIsConfirmationModalOpened(false);
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    const refusePayment = () => {
        setIsOrderModalOpened(false);
        setIsOrderDetailsOpened(false);
        setOrderPaid(false);
    }

    return (
        <div>
            {isConfirmationModalOpened && <ConfirmationModal text={confirmationModalInfo.text} onAccept={confirmationModalInfo.onAccept} onReject={confirmationModalInfo.onReject} />}
            {
                isOrderDetailsOpened
                    ?
                    <div className='orderDetails'>
                        <h3 className='orderDetails__title'>{t('orderForm.thankForOrder')}</h3>
                        <div className='orderDetails__text'>{t('orderForm.details')}:</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>{t('orderForm.dateAndTime')}:</span> {orderReturned.date} {orderReturned.time}:00-{orderReturned.endTime}:00</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>{t('orderForm.watchSize')}:</span> {t(`watchSizes.${orderReturned.watchSize}`)}</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>{t('orderForm.price')}:</span> {orderReturned.price}</div>
                        {orderReturned.address && <div className='orderDetails__item'><span className='orderDetails__bold'>{t('orderForm.address')}:</span> {orderReturned.address}</div>}
                        <div className='orderDetails__text'>{t('orderForm.howToPay')}</div>
                        {orderPaid
                            ?
                            <div className='orderDetails__text'><span className='orderDetails__bold'>{t('orderForm.paymentSuccess')}</span></div>
                            :
                            <div className="orderDetails__buttons">
                                <OrderButton onClick={() => setCheckout(true)}>{t('orderForm.payNow')}</OrderButton>
                                <OrderButton onClick={refusePayment}>{t('orderForm.payLater')}</OrderButton>
                            </div>
                        }

                    </div>
                    :
                    isFormOpened
                        ?
                        <ClientOrderForm order={order} onClick={checkUserExist} cities={cities}></ClientOrderForm>
                        :
                        <MasterChoice freeMasters={freeMasters} returnForm={returnForm} price={order.price} addOrder={addOrder}></MasterChoice>
            }
            <MyModal visible={checkout} setVisible={setCheckout}>
                {checkout && <PayPal price={orderReturned.price} watchSize={t(`watchSizes.${orderReturned.watchSize}`)} orderId={orderReturned.id} setCheckout={setCheckout} onApprove={() => setOrderPaid(true)} />}
            </MyModal>
        </div>
    )
}