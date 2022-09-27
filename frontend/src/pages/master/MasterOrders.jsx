import React, { useEffect, useState } from 'react';
import { MasterService, OrderService } from '../../API/Server';
import { ChangeStatusMasterForm } from '../../components/Forms/ChangeStatusMasterForm';
import { Loader } from '../../components/Loader/Loader';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { jwtPayload } from '../../components/PrivateRoute';
import { ColumnHead } from '../../components/Table/ColumnHead';
import { Table } from '../../components/Table/Table';
import { ORDER_MASTER_STATUSES_TRANSLATE, ROLES, WATCH_SIZES_TRANSLATE } from '../../constants';
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
    { value: 'change', title: 'Статус', sortable: false }
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

    const [currentOrder, setCurrentOrder] = useState(null);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

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

    const changeStatus = async (order) => {
        if (order.status === 'completed') {
            await OrderService.changeStatusById(order.id, order.status);
            fetchOrders();
        }
        notify(NOTIFY_TYPES.SUCCESS, 'Статус успешно изменен');
        setIsModalOpened(false);
    };

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
                            <td>{ORDER_MASTER_STATUSES_TRANSLATE[order.status === 'completed' ? 'completed' : 'not completed']}</td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentOrder(orders.find(orderToFind => orderToFind.id === order.id)); }}><span>Выставить</span></td>
                        </tr>
                        )}
                    </tbody>
                </Table>

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
