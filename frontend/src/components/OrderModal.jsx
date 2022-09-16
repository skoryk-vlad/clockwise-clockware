import React, { useEffect, useState } from 'react'
import { CityService, ClientService, MasterService, OrderService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import classes from './OrderModal.module.css';
import { ClientOrderForm } from './Forms/ClientOrderForm';
import { WATCH_SIZES, ORDER_STATUSES } from '../constants.ts';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: Object.keys(WATCH_SIZES)[0],
    cityId: null,
    date: "",
    time: null,
    status: Object.keys(ORDER_STATUSES)[0]
};

export const OrderModal = ({ setMessage, setIsOrderModalOpened }) => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);
    const [chosenMaster, setChosenMaster] = useState(null);

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
    const findMasters = async (order) => {
        const client = await ClientService.checkClientByEmail(order.email);
        console.log(client);
        if (!client) {
            setOrder(order);
            setChosenMaster(null)
            const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
            setFreeMasters(freeMasters.sort((a, b) => b.rating - a.rating).map(master => master.rating && +master.rating !== 0 ? master : { ...master, rating: '-' }));
            setIsFormOpened(false);
        } else {
            setMessage({ show: true, color: 'red', message: 'Для оформления заказа сперва авторизуйтесь!' });
            setIsOrderModalOpened(false);
        }
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    return (
        <div>
            {
                isFormOpened
                    ?
                    <ClientOrderForm order={order} onClick={findMasters} cities={cities}></ClientOrderForm>
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