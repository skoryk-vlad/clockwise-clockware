import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { ChangeStatusForm } from '../../components/Forms/ChangeStatusForm';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar'
import { Table } from '../../components/Table/Table';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

const defaultOrder = {
    rating: 0,
    status: ''
};

const statuses = {
    'awaiting confirmation': 'Ожидает подтверждения',
    'confirmed': 'Подтвержден',
    'completed': 'Выполнен',
    'canceled': 'Отменен'
};
const watchSizes = {
    'small': 'Маленькие',
    'medium': 'Средние',
    'big': 'Большие'
};

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [ordersCount, setOrdersCount] = useState(0);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders();

        setOrdersCount(orders.length);

        setOrders(orders.filter(order => order.status === 'awaiting confirmation' || order.status === 'confirmed'));
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();
        const clients = await ClientService.getClients();

        setCities(cities);
        setMasters(masters);
        setClients(clients);
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

    const changeStatus = async (values) => {
        await OrderService.changeStatusById(values.id, values.status, values.rating);
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
        `CityMaster.City.name`,
        `Client.name`,
        `CityMaster.Master.name`,
        `status`,
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
                        data={orders.map(order => ({...order, status: statuses[order.status], watchSize: watchSizes[order.watchSize]}))}
                        tableHeaders={tableHeaders}
                        tableBodies={tableBodies}
                    />
                </div>
            </div>

            <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                {currentOrder && <ChangeStatusForm order={currentOrder} onClick={changeStatus}></ChangeStatusForm>}
            </MyModal>
        </div>
    )
}
