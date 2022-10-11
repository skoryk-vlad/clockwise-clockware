import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService, UserService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, ROLES, WATCH_SIZES_TRANSLATE } from '../constants';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { jwtPayload } from './PrivateRoute';
import { notify, NOTIFY_TYPES } from './Notifications';
import { MasterChoice } from './MasterChoice/MasterChoice';
import { OrderButton } from './OrderButton/OrderButton';
import { PayPal } from './PayPal';
import { MyModal } from './modal/MyModal';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.AWAITING_PAYMENT,
    images: []
};

export const OrderModal = ({ isOrderModalOpened, setIsOrderModalOpened, login, register }) => {
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
        setCities(cities.rows);
    });
    useEffect(() => {
        fetchCities();
    }, []);
    useEffect(() => {
        if(isOrderModalOpened === false) refusePayment();
    }, [isOrderModalOpened]);

    const addOrder = async (chosenMaster) => {
        const formData = new FormData();
        Array.from(order.images).map(image => formData.append(`images`, image));
        Object.entries(order).forEach(([key, value]) => formData.append(key, value));
        formData.append("masterId", chosenMaster);
        
        const orderReturned = await OrderService.addOrder(formData);
        setOrderReturned(orderReturned);
        setIsFormOpened(true);
        notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно получен!');
        setOrder(defaultOrder);
        setIsOrderDetailsOpened(true);
    }
    const checkUserExist = async (order) => {
        setOrder(order);
        const client = await UserService.checkUserByEmail(order.email);
        if (!client) {
            setIsConfirmationModalOpened(true);
            setConfirmationModalInfo({
                text: 'Вы желаете зарегистрироваться для просмотра истории заказов?',
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
                        text: `В системе Ваша учетная запись сохранена с именем ${client.name}, а Вы сейчас ввели ${order.name}. Желаете заменить?`,
                        onAccept: () => { setIsConfirmationModalOpened(false); login(); },
                        onReject: () => { setOrder({ ...order, name: client.name }); setIsConfirmationModalOpened(false); login(); }
                    });
                } else {
                    login();
                }
                notify(NOTIFY_TYPES.ERROR, 'Для оформления заказа сперва авторизуйтесь!');
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
                        <h3 className='orderDetails__title'>Спасибо за оформление заказа!</h3>
                        <div className='orderDetails__text'>Детали:</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>Дата и время:</span> {orderReturned.date} {orderReturned.time}:00-{orderReturned.endTime}:00</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>Размер часов:</span> {WATCH_SIZES_TRANSLATE[orderReturned.watchSize]}</div>
                        <div className='orderDetails__item'><span className='orderDetails__bold'>Цена:</span> {orderReturned.price}</div>
                        <div className='orderDetails__text'>Вы можете оплатить заказ сейчас или же наличными мастеру перед выполнением.</div>
                        {orderPaid
                            ?
                            <div className='orderDetails__text'><span className='orderDetails__bold'>Спасибо! Оплата прошла успешно. Ожидайте выполнение заказа мастером.</span></div>
                            :
                            <div className="orderDetails__buttons">
                                <OrderButton onClick={() => setCheckout(true)}>Оплатить сейчас</OrderButton>
                                <OrderButton onClick={refusePayment}>На месте</OrderButton>
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
                {checkout && <PayPal price={orderReturned.price} watchSize={WATCH_SIZES_TRANSLATE[orderReturned.watchSize]} orderId={orderReturned.id} setCheckout={setCheckout} onApprove={() => setOrderPaid(true)} />}
            </MyModal>
        </div>
    )
}