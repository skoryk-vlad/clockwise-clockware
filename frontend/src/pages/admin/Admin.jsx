import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { ChangeStatusForm } from '../../components/Forms/ChangeStatusForm';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar'
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { ColumnHead, sortByColumn } from '../../components/Table/ColumnHead';
import { Table } from '../../components/Table/Table';
import { ORDER_STATUSES, ORDER_STATUSES_TRANSLATE, ROLES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

const defaultOrder = {
    status: ''
};

const defaultFilterState = {
    statuses: [ORDER_STATUSES.AWAITING_CONFIRMATION, ORDER_STATUSES.CONFIRMED],
};
const defaultPagination = {
    page: 1,
    limit: 10
};
const defaultsortState = {
    value: 'date',
    isDirectedASC: true
};
const tableHeaders = [
    { value: 'id', title: 'id', clickable: true },
    { value: 'watchSize', title: 'Размер часов', clickable: true },
    { value: 'date', title: 'Дата', clickable: true },
    { value: 'time', title: 'Время', clickable: true },
    { value: 'rating', title: 'Рейтинг', clickable: true },
    { value: 'City.name', title: 'Город', clickable: true },
    { value: 'Client.name', title: 'Клиент', clickable: true },
    { value: 'Master.name', title: 'Мастер', clickable: true },
    { value: 'status', title: 'Статус', clickable: true },
    { value: 'price', title: 'Цена', clickable: true },
    { value: 'change', title: 'Изменение', clickable: false }
];

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [filterState, setFilterState] = useState(defaultFilterState);
    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortState, setSortState] = useState(defaultsortState);

    const [ordersCount, setOrdersCount] = useState(0);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders({ ...filterState, ...pagination });
        setTotalPages(Math.ceil(orders.count / pagination.limit));
        setOrdersCount(orders.count);
        sortByColumn(orders.rows, sortState.value, sortState.isDirectedASC, setOrders);
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();
        const clients = await ClientService.getClients();

        setCities(cities.rows);
        setMasters(masters.rows);
        setClients(clients.rows);
    });

    useEffect(() => {
        document.title = "Админ-панель - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [pagination]);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentOrder(null);
    }, [isModalOpened]);

    const changeStatus = async (order) => {
        try {
            await OrderService.changeStatusById(order.id, order.status);
            setIsModalOpened(false);
            notify(NOTIFY_TYPES.SUCCESS, 'Статус успешно изменен');
            fetchOrders();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    };

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
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
                            <div className='top__title'>Активных заказов</div>
                            <div className='top__body'>{ordersCount}</div>
                        </div>
                    </div>
                    <h2 className='admin-main__title'>Активные заказы</h2>

                    <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })}
                        changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                        currentPage={pagination.page} totalPages={totalPages}>
                        <thead>
                            <tr>
                                {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                    key={tableHeader.value} onClick={tableHeader.clickable && (value => {
                                        sortByColumn(orders, value, sortState.value === value ? !sortState.isDirectedASC : true, setOrders);
                                        sortState.value === value ? setSortState({ value, isDirectedASC: !sortState.isDirectedASC }) : setSortState({ value, isDirectedASC: true })
                                    })}
                                    clickable={tableHeader.clickable} sortState={sortState} />)}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{WATCH_SIZES_TRANSLATE[order.watchSize]}</td>
                                <td>{order.date}</td>
                                <td>{order.time}</td>
                                <td>{order.rating}</td>
                                <td>{order.City.name}</td>
                                <td>{order.Client.name}</td>
                                <td>{order.Master.name}</td>
                                <td>{ORDER_STATUSES_TRANSLATE[order.status]}</td>
                                <td>{order.price}</td>
                                <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentOrder(orders.find(orderToFind => orderToFind.id === order.id)); }}><span>Изменить</span></td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </div>

            <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                {currentOrder && <ChangeStatusForm order={currentOrder} onClick={changeStatus}></ChangeStatusForm>}
            </MyModal>
        </div>
    )
}
