import React, { useEffect, useState } from 'react';
import { MasterService, OrderService } from '../../API/Server';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { Loader } from '../../components/Loader/Loader';
import { Navbar } from '../../components/Navbar/Navbar';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { jwtPayload } from '../../components/PrivateRoute';
import { ColumnHead } from '../../components/Table/ColumnHead';
import { Table } from '../../components/Table/Table';
import { ORDER_MASTER_STATUSES, ORDER_MASTER_STATUSES_TRANSLATE, ORDER_STATUSES, ROLES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';

const tableHeaders = [
    { value: 'client', title: 'Клиент', sortable: true },
    { value: 'watchSize', title: 'Размер часов', sortable: true },
    { value: 'city', title: 'Город', sortable: true },
    { value: 'date', title: 'Дата', sortable: true },
    { value: 'time', title: 'Время начала', sortable: true },
    { value: 'endTime', title: 'Время конца', sortable: true },
    { value: 'price', title: 'Цена', sortable: true },
    { value: 'status', title: 'Статус', sortable: true },
    { value: 'change', title: 'Статус', sortable: false },
    { value: 'images', title: 'Фото', sortable: false },
    { value: 'receipt', title: 'Чек', sortable: false }
];
const defaultPagination = {
    page: 1,
    limit: 10
};
const defaultSortByField = {
    sortedField: 'date',
    isDirectedASC: false
};

export const MasterOrders = () => {
    const [orders, setOrders] = useState([]);

    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [isConfirmationModalOpened, setIsConfirmationModalOpened] = useState(false);
    const [confirmationModalInfo, setConfirmationModalInfo] = useState({
        text: '',
        onAccept: () => { },
        onReject: () => { }
    });

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const payload = jwtPayload(localStorage.getItem('token'));
        const orders = await MasterService.getMasterOrders(payload.id, { ...pagination, ...sortByField });
        setTotalPages(Math.ceil(orders.count / pagination.limit));
        setOrders(orders.rows);
    });

    useEffect(() => {
        document.title = "Личный кабинет мастера - Clockwise Clockware";
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [pagination, sortByField]);

    const changeStatus = async (id) => {
        setIsConfirmationModalOpened(true);
        setConfirmationModalInfo({
            text: 'Вы уверены, что хотите отметить заказ выполненным?',
            onAccept: async () => {
                await OrderService.changeStatusById(id, ORDER_STATUSES.COMPLETED);
                fetchOrders();
                setIsConfirmationModalOpened(false);
                notify(NOTIFY_TYPES.SUCCESS, 'Статус успешно изменен!');
            },
            onReject: () => setIsConfirmationModalOpened(false)
        });
    };

    const downloadImages = async (id) => {
        try {
            await OrderService.getOrderImages(id);
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
        }
    }
    const downloadReceipt = async (id) => {
        try {
            await OrderService.createReceipt(id);
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.MASTER} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })}
                    changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                    currentPage={pagination.page} totalPages={totalPages}>
                    <thead>
                        <tr>
                            {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                onClick={tableHeader.sortable &&
                                    (sortedField => sortByField.sortedField === sortedField
                                        ? setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC })
                                        : setSortByField({ sortedField: sortedField, isDirectedASC: true }))} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => <tr key={order.id}>
                            <td>{order.client}</td>
                            <td>{WATCH_SIZES_TRANSLATE[order.watchSize]}</td>
                            <td>{order.city}</td>
                            <td>{order.date}</td>
                            <td>{order.time}</td>
                            <td>{order.endTime}</td>
                            <td>{order.price}</td>
                            <td>{ORDER_MASTER_STATUSES_TRANSLATE[order.status] || ORDER_MASTER_STATUSES_TRANSLATE[ORDER_MASTER_STATUSES.NOT_COMPLETED]}</td>
                            <td className='tableLink' onClick={order.status !== ORDER_MASTER_STATUSES.COMPLETED && order.status !== ORDER_MASTER_STATUSES.CANCELED ? () => changeStatus(order.id) : () => { }}>
                                {order.status !== ORDER_MASTER_STATUSES.COMPLETED && order.status !== ORDER_MASTER_STATUSES.CANCELED ? <span>Отметить</span> : `-`}
                            </td>
                            <td className='tableLink' onClick={order.imagesLinks && order.imagesLinks.length ? () => downloadImages(order.id) : () => { }}>
                                {order.imagesLinks && order.imagesLinks.length ? <span>Скачать</span> : '-'}</td>
                            <td className='tableLink' onClick={order.status === ORDER_STATUSES.COMPLETED ? () => downloadReceipt(order.id) : () => { }}>
                                {order.status === ORDER_STATUSES.COMPLETED ? <span>Скачать</span> : '-'}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>

                {isConfirmationModalOpened && <ConfirmationModal text={confirmationModalInfo.text} onAccept={confirmationModalInfo.onAccept} onReject={confirmationModalInfo.onReject} />}
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
