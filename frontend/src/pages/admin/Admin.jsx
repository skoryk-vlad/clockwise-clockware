import React, { useEffect, useState } from 'react'
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { Navbar } from '../../components/Navbar/Navbar'
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);

    const [ordersCount, setOrdersCount] = useState(0);

    const checkZero = (num) => {
        return num > 9 ? num : '0' + num;
    };

    const toDate = (strDate) => {
        const date = new Date(strDate);
        return `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;
    }

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders(localStorage.getItem('token'));
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();
        const clients = await ClientService.getClients(localStorage.getItem('token'));

        setOrdersCount(orders.length);

        setOrders(orders.filter(o => !o.completed).map(o => ({ ...o, date: toDate(o.date) })));
        setCities(cities);
        setMasters(masters);
        setClients(clients);
    });

    useEffect(() => {
        fetchOrders();
        document.title = "Админ-панель - Clockwise Clockware";
    }, []);

    const completeOrder = async (e) => {
        const id = e.target.closest('tr').id;

        await OrderService.completeOrderById(id, localStorage.getItem('token'));
        fetchOrders();
    };

    return (
        <div className='admin-container'>
            <Navbar/>
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
                            <div className='top__title'>Осталось</div>
                            <div className='top__body'>{orders.length}</div>
                        </div>
                    </div>

                    <AdminTable dataArr={orders} completeOrd={e => completeOrder(e)} />
                </div>
            </div>
        </div>
    )
}