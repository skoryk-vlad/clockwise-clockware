import React, { useEffect, useState } from 'react'
import { CityService, ClientService, MasterService, OrderService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import classes from './OrderModal.module.css';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES, CLIENT_STATUSES } from '../constants';
import { Confirm } from './Confirm/Confirm';
import { jwtPayload } from './PrivateRoute';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: Object.keys(WATCH_SIZES)[0],
    cityId: null,
    date: "",
    time: null,
    status: Object.keys(ORDER_STATUSES)[0]
};

export const OrderModal = ({ setMessage, setIsOrderModalOpened, login }) => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);
    const [chosenMaster, setChosenMaster] = useState(null);

    const [isConfirmOpened, setIsConfirmOpened] = useState(false);
    const [confirmInfo, setConfirmInfo] = useState({
        text: '',
        onAccept: () => { },
        onReject: () => { }
    });

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities);
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
        setMessage({ show: true, color: 'green', message: 'Заказ успешно получен! Для подтверждения заказа перейдите по ссылке, отправленной на вашу электронную почту!' });
        setOrder(defaultOrder);
        setIsFormOpened(true);
    }
    const checkUserExist = async (order) => {
        setOrder(order);
        const client = await ClientService.checkClientByEmail(order.email);
        if (!client) {
            setIsConfirmOpened(true);
            setConfirmInfo({
                text: 'Вы желаете зарегистрироваться для просмотра истории заказов?',
                onAccept: () => registerClient(order),
                onReject: () => findMasters(order)
            });
        } else {
            if (jwtPayload(localStorage.getItem('token'))?.role === 'client' && jwtPayload(localStorage.getItem('token'))?.id === client.id) {
                findMasters(order);
            } else {
                if (order.name !== client.name) {
                    setIsConfirmOpened(true);
                    setConfirmInfo({
                        text: `В системе Ваша учетная запись сохранена с именем ${client.name}, а Вы сейчас ввели ${order.name}. Желаете заменить?`,
                        onAccept: () => { setIsConfirmOpened(false); login(); },
                        onReject: () => { setOrder({ ...order, name: client.name }); setIsConfirmOpened(false); login(); }
                    });
                } else {
                    login();
                }
                setMessage({ show: true, color: 'red', message: 'Для оформления заказа сперва авторизуйтесь!' });
            }
        }
    }
    
    const registerClient = async (order) => {
        await ClientService.addClient({ name: order.name, email: order.email, status: Object.keys(CLIENT_STATUSES)[0] });
        setMessage({ show: true, color: 'green', message: 'Аккаунт успешно создан!' });
        findMasters();
    }
    const findMasters = async (order) => {
        setChosenMaster(null)
        const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
        setFreeMasters(freeMasters.sort((a, b) => b.rating - a.rating).map(master => master.rating && +master.rating !== 0 ? master : { ...master, rating: '-' }));
        setIsFormOpened(false);
        setIsConfirmOpened(false);
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    return (
        <div>
            {isConfirmOpened && <Confirm text={confirmInfo.text} onAccept={confirmInfo.onAccept} onReject={confirmInfo.onReject} />}
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