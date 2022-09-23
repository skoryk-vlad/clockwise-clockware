import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { OrderForm } from '../../components/Forms/OrderForm';
import { ORDER_STATUSES, ORDER_STATUSES_TRANSLATE, ROLES, WATCH_SIZES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { Table } from '../../components/Table/Table';
import { ColumnHead, sortByColumn } from '../../components/Table/ColumnHead';
import { OrderFilterForm } from '../../components/Forms/OrderFilterForm';
import { addDays, formatISO } from 'date-fns';

const defaultOrder = {
    clientId: null,
    masterId: null,
    cityId: null,
    watchSize: WATCH_SIZES.SMALL,
    date: '',
    time: null,
    rating: 0,
    status: ORDER_STATUSES.AWAITING_CONFIRMATION
};

const defaultFilterState = {
    masters: [],
    cities: [],
    statuses: [],
    dateStart: formatISO(addDays(new Date(), -30), { representation: 'date' }),
    dateEnd: ''
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
    { value: 'change', title: 'Изменение', clickable: false },
    { value: 'delete', title: 'Удаление', clickable: false }
];

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [clients, setClients] = useState([]);
    const [masters, setMasters] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [filterState, setFilterState] = useState(defaultFilterState);
    const [totalPages, setTotalPages] = useState(0);
    const [sortState, setSortState] = useState(defaultsortState);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders({ ...filterState, ...pagination });
        setTotalPages(Math.ceil(orders.count / pagination.limit));
        sortByColumn(orders.rows, sortState.value, sortState.isDirectedASC, setOrders);
    });
    const [fetchAdditionalData, isAdditionalDataLoading] = useFetching(async () => {
        const cities = await CityService.getCities();
        const clients = await ClientService.getClients();
        const masters = await MasterService.getMasters();

        setCities(cities.rows);
        setClients(clients.rows);
        setMasters(masters.rows);
    });

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [filterState, pagination]);

    useEffect(() => {
        if (Error)
            setOrders([]);
    }, [Error]);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentOrder(null);
    }, [isModalOpened]);

    const deleteOrder = async (id) => {
        try {
            await OrderService.deleteOrderById(id);
            notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно удален');
            fetchOrders();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const addOrder = async (order) => {
        try {
            const client = clients.find(client => client.id === order.clientId);
            await OrderService.addOrder({ ...order, name: client.name, email: client.email });
            notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно добавлен');
            setIsModalOpened(false);
            fetchOrders();
            return true;
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const updateOrder = async (order) => {
        try {
            await OrderService.updateOrderById(order);
            notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно изменен');
            setIsModalOpened(false);
            fetchOrders();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>
                <div className='admin-body__top'>
                    {!isAdditionalDataLoading && <OrderFilterForm filterState={{
                        ...defaultFilterState,
                        masters: Array.isArray(defaultFilterState.masters) ? defaultFilterState.masters.map(masterId => ({ value: masterId, label: masters.find(master => masterId === master.id)?.name })) : [],
                        cities: Array.isArray(defaultFilterState.cities) ? defaultFilterState.cities.map(cityId => ({ value: cityId, label: cities.find(city => cityId === city.id)?.name })) : [],
                        statuses: Array.isArray(defaultFilterState.statuses) ? defaultFilterState.statuses.map(status => ({ value: status, label: ORDER_STATUSES_TRANSLATE[status] })) : []
                    }}
                        onClick={newFilterState => { JSON.stringify(filterState) !== JSON.stringify(newFilterState) && setFilterState(newFilterState); }}
                        cities={cities} masters={masters} setFilterState={setFilterState}></OrderFilterForm>}

                    <div className="admin-body__btns">
                        <AdminButton onClick={() => { setIsModalOpened(true); setCurrentOrder(defaultOrder) }}>
                            Добавить
                        </AdminButton>
                    </div>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentOrder && <OrderForm order={currentOrder} onClick={currentOrder?.id ? updateOrder : addOrder}
                        clients={clients} cities={cities} btnTitle={currentOrder?.id ? 'Изменить' : 'Добавить'}></OrderForm>}
                </MyModal>

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
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentOrder(orders.find(orderToFind => orderToFind.id === order.id)) }}><span>Изменить</span></td>
                            <td className='tableLink' onClick={() => deleteOrder(order.id)}><span>Удалить</span></td>
                        </tr>
                        )}
                    </tbody>
                </Table>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка {Error}</h2>
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
