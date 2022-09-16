import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { ClientOrderForm } from '../../components/Forms/ClientOrderForm';
import { ClientPersonalForm } from '../../components/Forms/ClientPersonalForm';
import { Loader } from '../../components/Loader/Loader';
import { Message } from '../../components/Message/Message';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { OrderButton } from '../../components/OrderButton/OrderButton';
import { jwtPayload } from '../../components/PrivateRoute';
import { Table } from '../../components/Table/Table';
import { WATCH_SIZES, ORDER_STATUSES } from '../../constants.ts';
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

    const [client, setClient] = useState({});
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

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
        console.log(order);
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
        document.title = "Личный кабинет мастера - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    const addOrder = async () => {
        try {
            await OrderService.addOrder({ ...order, name: client.name, email: client.email });
            setIsModalOpened(false);
            setIsFormOpened(true);
            setShowMessage(true);
            setOrder(defaultOrder);
            setIsFormOpened(true);
            fetchOrders();
        } catch (error) {
            console.log(error.response.data);
            // setErrorModal(true);
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
            name: `Изменить`,
            callback: () => console.log('Изменить'),
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
                {showMessage && <Message setShowMessage={setShowMessage}>Заказ успешно получен! Для подтверждения заказа перейдите по ссылке, отправленной на вашу электронную почту!</Message>}

                <Table
                    data={orders.map(order => ({ ...order, watchSize: WATCH_SIZES[order.watchSize], status: ORDER_STATUSES[order.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                {/* <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal> */}

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
