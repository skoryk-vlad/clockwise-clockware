import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService, UserService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, ROLES } from '../constants';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { jwtPayload } from './PrivateRoute';
import { notify, NOTIFY_TYPES } from './Notifications';
import { MasterChoice } from './MasterChoice/MasterChoice';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.COMPLETED,
    images: []
};

export const OrderModal = ({ setIsOrderModalOpened, login, register }) => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);

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
        const formData = new FormData();
        Array.from(order.images).map(image => formData.append(`images`, image));
        Object.entries(order).forEach(([key, value]) => formData.append(key, value));
        formData.append("masterId", chosenMaster);
        await OrderService.addOrder(formData);
        setIsFormOpened(true);
        setIsOrderModalOpened(false);
        notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно получен!');
        setOrder(defaultOrder);
        setIsFormOpened(true);
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
        setFreeMasters(freeMasters.map(master => !master.rating ? ({...master, rating: '-'}) : master));
        setIsFormOpened(false);
        setIsConfirmationModalOpened(false);
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    return (
        <div>
            {isConfirmationModalOpened && <ConfirmationModal text={confirmationModalInfo.text} onAccept={confirmationModalInfo.onAccept} onReject={confirmationModalInfo.onReject} />}
            {
                isFormOpened
                    ?
                    <ClientOrderForm order={order} onClick={checkUserExist} cities={cities}></ClientOrderForm>
                    :
                    <MasterChoice freeMasters={freeMasters} returnForm={returnForm} price={order.price} addOrder={addOrder}></MasterChoice>
            }
        </div>
    )
}