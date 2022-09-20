import React, { useEffect, useState } from 'react';
import { MasterService, OrderService } from '../../API/Server';
import { ChangeStatusMasterForm } from '../../components/Forms/ChangeStatusMasterForm';
import { Loader } from '../../components/Loader/Loader';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { jwtPayload } from '../../components/PrivateRoute';
import { Table } from '../../components/Table/Table';
import { ORDER_MASTER_STATUSES_TRANSLATE, ROLES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

export const MasterOrders = () => {
    const [orders, setOrders] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const payload = jwtPayload(localStorage.getItem('token'))
        const orders = await MasterService.getMasterOrders(payload.id);

        setOrders(orders);
    });

    useEffect(() => {
        document.title = "Личный кабинет мастера - Clockwise Clockware";
        fetchOrders();
    }, []);

    const changeStatus = async (order) => {
        if(order.status === 'completed') {
            await OrderService.changeStatusById(order.id, order.status);
            fetchOrders();
        }
        notify(NOTIFY_TYPES.SUCCESS, 'Статус успешно изменен');
        setIsModalOpened(false);
    };

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
            callback: id => { setIsModalOpened(true); setCurrentOrder(orders.find(order => order.id === id)); },
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.MASTER} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <Table
                    data={orders.map(order => ({ ...order, watchSize: WATCH_SIZES_TRANSLATE[order.watchSize], status: ORDER_MASTER_STATUSES_TRANSLATE[order.status === 'completed' ? 'completed' : 'not completed'] }))}
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
            <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                {currentOrder && <ChangeStatusMasterForm order={{ id: currentOrder.id, status: currentOrder.status === 'completed' ? 'completed' : 'not completed' }} onClick={changeStatus}></ChangeStatusMasterForm>}
            </MyModal>
        </div>
    )
}
