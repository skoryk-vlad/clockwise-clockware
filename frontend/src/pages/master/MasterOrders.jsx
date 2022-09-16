import React, { useEffect, useState } from 'react';
import { OrderService } from '../../API/Server';
import { Loader } from '../../components/Loader/Loader';
import { Navbar } from '../../components/Navbar/Navbar';
import { jwtPayload } from '../../components/PrivateRoute';
import { Table } from '../../components/Table/Table';
import { WATCH_SIZES, ORDER_STATUSES } from '../../constants.ts';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

export const MasterOrders = () => {
    const [orders, setOrders] = useState([]);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const payload = jwtPayload(localStorage.getItem('token'))
        const orders = await OrderService.getOrders(payload.role, payload.id);
        // const orders = await OrderService.getOrders(payload.role, 1);

        setOrders(orders);
    });

    useEffect(() => {
        document.title = "Личный кабинет мастера - Clockwise Clockware";
        fetchOrders();
    }, []);

    const tableHeaders = ["Клиент", "Размер часов", "Город", "Дата", "Время начала", "Время конца", "Цена", "Статус", "Статус"];

    const tableBodies = [
        `client`,
        `watchSize`,
        `city`,
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
            <Navbar role='master' />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <Table
                    data={orders.map(order => ({ ...order, watchSize: WATCH_SIZES[order.watchSize], status: ORDER_STATUSES[order.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {orders.length === 0 && !isOrdersLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isOrdersLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
