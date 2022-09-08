import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { CityService, ClientService, MasterService, OrderService, StatusService } from '../../API/Server';
import { ChangeStatusForm } from '../../components/Forms/ChangeStatusForm';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar'
import { Table } from '../../components/Table/Table';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

const defaultOrder = {
    rating: 0,
    statusId: null
};

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [ordersCount, setOrdersCount] = useState(0);

    const [redirect, setRedirect] = useState(false);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders();

        setOrdersCount(orders.length);

        setOrders(orders.filter(order => order.statusId === 1 || order.statusId === 2));
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();
        const clients = await ClientService.getClients();
        const statuses = await StatusService.getStatuses();

        setCities(cities);
        setMasters(masters);
        setClients(clients);
        setStatuses(statuses);
    });

    useEffect(() => {
        document.title = "Админ-панель - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentOrder(null);
    }, [isModalOpened]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const changeStatus = async (values) => {
        await OrderService.changeStatusById(values.id, values.statusId, values.rating);
        setIsModalOpened(false);
        fetchOrders();
    };

    const tableHeaders = ["id", "Размер часов", "Дата", "Время", "Рейтинг", "Город", "Клиент", "Мастер", "Статус", "Изменение"];

    const tableBodies = [
        `id`,
        `watchSize`,
        `date`,
        `time`,
        `rating`,
        `City.name`,
        `Client.name`,
        `Master.name`,
        `Status.name`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentOrder(orders.find(order => order.id === id)); },
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Главная</h1>
                <div className='admin-main'>
                    <div className='admin-main__top top'>
                        <div className='top__item'>
                            <div className='top__title'>Городов</div>
                            <div className='top__body'>{cities.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>Мастеров</div>
                            <div className='top__body'>{masters.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>Клиентов</div>
                            <div className='top__body'>{clients.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>Заказов</div>
                            <div className='top__body'>{ordersCount}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>Активных</div>
                            <div className='top__body'>{orders.length}</div>
                        </div>
                    </div>
                    <h2 className='admin-main__title'>Активные заказы</h2>
                    <Table
                        data={orders}
                        tableHeaders={tableHeaders}
                        tableBodies={tableBodies}
                    />
                </div>
            </div>

            <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                {currentOrder && <ChangeStatusForm order={currentOrder} onClick={changeStatus} statuses={statuses}></ChangeStatusForm>}
            </MyModal>
        </div>
    )
}
