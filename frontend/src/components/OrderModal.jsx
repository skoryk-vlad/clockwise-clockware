import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService, UserService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import classes from './OrderModal.module.css';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, ROLES } from '../constants';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { jwtPayload } from './PrivateRoute';
import { notify, NOTIFY_TYPES } from './Notifications';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.CONFIRMED
};

export const OrderModal = ({ setIsOrderModalOpened, login, register }) => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);
    const [chosenMaster, setChosenMaster] = useState(null);

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

    const chooseMaster = (event) => {
        const masterId = event.target.closest(`.mstr_itm`).id;
        setChosenMaster(+masterId);
        setOrder({ ...order, masterId: +masterId });
    };

    const addOrder = async () => {
        await OrderService.addOrder(order);
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
                notify(NOTIFY_TYPES.SUCCESS, 'Для оформления заказа сперва авторизуйтесь!');
            }
        }
    }
    
    const registerClient = async () => {
        setIsConfirmationModalOpened(false);
        register();
    }
    const findMasters = async (order) => {
        setChosenMaster(null);
        const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
        setFreeMasters(freeMasters.sort((a, b) => b.rating - a.rating).map(master => master.rating && +master.rating !== 0 ? master : { ...master, rating: '-' }));
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
                    <div className={classes.mastersBlock}>
                        <div className={classes.mastersList}>
                            {
                                freeMasters.map(master =>
                                    <div key={master.id} id={master.id} className={classes.masterItem + ' mstr_itm' + (+chosenMaster === master.id ? ' ' + classes.active : '')}>
                                        <div className={classes.masterName}>{master.name}</div>
                                        <div className={classes.masterRating}>Рейтинг: {master.rating}</div>
                                        <OrderButton onClick={event => chooseMaster(event)} className={classes.masterBtn}>Выбрать</OrderButton>
                                    </div>
                                )
                            }
                            {
                                freeMasters.length === 0 &&
                                <div className={classes.warning}>К сожалению, мастеров на это время в этот день нет. Выберите другое время или дату.</div>
                            }
                            <div className={classes.return} onClick={returnForm}>
                                <img src="/images/icons/top.png" alt="Назад" />
                            </div>
                        </div>
                        <OrderButton onClick={() => { addOrder() }} className={(chosenMaster === null ? "disabledBtn" : '')}
                            disabled={chosenMaster === null}>Оформить заказ</OrderButton>
                    </div>
            }
        </div>
    )
}