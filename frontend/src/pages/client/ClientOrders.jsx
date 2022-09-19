import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { ClientPersonalForm } from '../../components/Forms/ClientPersonalForm';
import { SetRatingForm } from '../../components/Forms/SetRatingForm';
import { Loader } from '../../components/Loader/Loader';
import { Message } from '../../components/Message/Message';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { OrderButton } from '../../components/OrderButton/OrderButton';
import { jwtPayload } from '../../components/PrivateRoute';
import { Table } from '../../components/Table/Table';
import { WATCH_SIZES, ORDER_STATUSES } from '../../constants';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

const defaultOrder = {
    masterId: null,
    cityId: null,
    watchSize: Object.keys(WATCH_SIZES)[0],
    date: '',
    time: null,
    rating: 0,
    status: Object.keys(ORDER_STATUSES)[0]
};

export const ClientOrders = () => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);
    const [chosenMaster, setChosenMaster] = useState(null);

    const [orderId, setOrderId] = useState(null);
    const [isSetRatingOpened, setIsSetRatingOpened] = useState(false);

    const [client, setClient] = useState({});
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [message, setMessage] = useState({ show: false, color: 'green', message: '' });

    const [fetchOrders, isLoading, Error] = useFetching(async () => {
        const payload = jwtPayload(localStorage.getItem('token'))
        const orders = await OrderService.getOrders(payload.role, payload.id);

        setOrders(orders);
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const payload = jwtPayload(localStorage.getItem('token'));
        const client = await ClientService.getClientById(payload.id);
        const cities = await CityService.getCities();

        setClient(client);
        setCities(cities);
    });

    const chooseMaster = (event) => {
        const masterId = event.target.closest(`.mstr_itm`).id;
        setChosenMaster(+masterId);
        setOrder({ ...order, masterId: +masterId });
    };

    const findMasters = async (order) => {
        setOrder(order);
        setChosenMaster(null)
        const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
        setFreeMasters(freeMasters.sort((a, b) => b.rating - a.rating).map(master => master.rating && +master.rating !== 0 ? master : { ...master, rating: '-' }));
        setIsFormOpened(false);
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    useEffect(() => {
        document.title = "Личный кабинет клиента - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);
    useEffect(() => {
        if (isModalOpened === false) {
            setIsSetRatingOpened(false);
        }
    }, [isModalOpened]);

    const addOrder = async () => {
        try {
            await OrderService.addOrder({ ...order, name: client.name, email: client.email });
            setIsModalOpened(false);
            setIsFormOpened(true);
            setMessage({ show: true, color: 'green', message: 'Заказ успешно получен! Для подтверждения заказа перейдите по ссылке, отправленной на вашу электронную почту!' });
            setOrder(defaultOrder);
            setIsFormOpened(true);
            fetchOrders();
        } catch (error) {
            console.log(error.response.data);
        }
    }
    const setRating = async (order) => {
        setIsSetRatingOpened(false);
        setIsModalOpened(false);
        try {
            await OrderService.setOrderRating(orderId, order.rating);
            setIsSetRatingOpened(false);
            setIsModalOpened(false);
            setMessage({ show: true, color: 'green', message: 'Рейтинг успешно выставлен!' });
            fetchOrders();
        } catch (error) {
            console.log(error.response.data);
        }
    }

    const tableHeaders = ["Мастер", "Размер часов", "Дата", "Время начала", "Время конца", "Цена", "Статус", "Рейтинг"];

    const tableBodies = [
        `master`,
        `watchSize`,
        `date`,
        `time`,
        `endTime`,
        `price`,
        `status`,
        {
            mixed: true,
            field: `rating`,
            name: `Выставить`,
            callback: id => {
                if(orders.find(order => order.id === id).status === 'completed') {
                    setOrderId(id); setIsSetRatingOpened(true); setIsModalOpened(true)
                } else {
                    setMessage({ show: true, color: 'red', message: 'Заказ еще не выполнен!' });
                }
            },
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role='client' />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {
                        isSetRatingOpened
                            ?
                            <SetRatingForm onClick={setRating} />
                            :
                            isFormOpened
                                ?
                                <ClientPersonalForm order={defaultOrder} onClick={findMasters} btnTitle={'Добавить'} cities={cities}></ClientPersonalForm>
                                :
                                <div className='mastersBlock'>
                                    <div className='mastersList'>
                                        {
                                            freeMasters.map(master =>
                                                <div key={master.id} id={master.id} className={'masterItem mstr_itm' + (+chosenMaster === master.id ? ' active' : '')}>
                                                    <div className='masterName'>{master.name}</div>
                                                    <div className='masterRating'>Рейтинг: {master.rating}</div>
                                                    <OrderButton onClick={event => chooseMaster(event)} className='masterBtn'>Выбрать</OrderButton>
                                                </div>
                                            )
                                        }
                                        {
                                            freeMasters.length === 0 &&
                                            <div className='warning'>К сожалению, мастеров на это время в этот день нет. Выберите другое время или дату.</div>
                                        }
                                        <div className='return' onClick={returnForm}>
                                            <img src="/images/icons/top.png" alt="Назад" />
                                        </div>
                                    </div>
                                    <OrderButton onClick={() => { addOrder() }} className={(chosenMaster === null ? "disabledBtn" : '')}
                                        disabled={chosenMaster === null}>Оформить заказ</OrderButton>
                                </div>
                    }
                </MyModal>
                {message.show && <Message setMessage={setMessage} message={message}>Заказ успешно получен! Для подтверждения заказа перейдите по ссылке, отправленной на вашу электронную почту!</Message>}

                <Table
                    data={orders.map(order => ({ ...order, watchSize: WATCH_SIZES[order.watchSize], status: ORDER_STATUSES[order.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {orders.length === 0 && !isLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
