import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService, PaymentService, UserService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, ROLES, WATCH_SIZES_TRANSLATE } from '../constants';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { jwtPayload } from './PrivateRoute';
import { notify, NOTIFY_TYPES } from './Notifications';
import { MasterChoice } from './MasterChoice/MasterChoice';
import { OrderButton } from './OrderButton/OrderButton';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};

export const OrderModal = ({ setIsOrderModalOpened, login, register }) => {
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

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities.rows);
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const addOrder = async (chosenMaster) => {
        const orderReturned = await OrderService.addOrder({ ...order, masterId: chosenMaster });
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

    const createPayment = async () => {
        const response = await PaymentService.pay(orderReturned.price, WATCH_SIZES_TRANSLATE[orderReturned.watchSize], orderReturned.id);
        if(response?.response?.data) {
            notify(NOTIFY_TYPES.ERROR);
        }
    }

    const refusePayment = () => {
        setIsOrderModalOpened(false);
        setIsOrderDetailsOpened(false);
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
                        <div className="orderDetails__buttons">
                            <OrderButton onClick={createPayment}>Оплатить сейчас</OrderButton>
                            <OrderButton onClick={refusePayment}>На месте</OrderButton>
                        </div>
                    </div>
                    :
                    isFormOpened
                        ?
                        <ClientOrderForm order={order} onClick={checkUserExist} cities={cities}></ClientOrderForm>
                        :
                        <MasterChoice freeMasters={freeMasters} returnForm={returnForm} price={order.price} addOrder={addOrder}></MasterChoice>
            }
        </div>
    )
}