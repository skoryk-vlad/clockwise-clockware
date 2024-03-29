import React, { useEffect, useState } from 'react';
import { CityService, ClientService, MasterService, OrderService } from '../../API/Server';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { ClientPersonalForm } from '../../components/Forms/ClientPersonalForm';
import { SetRatingForm } from '../../components/Forms/SetRatingForm';
import { Loader } from '../../components/Loader/Loader';
import { MasterChoice } from '../../components/MasterChoice/MasterChoice';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { PayPal } from '../../components/PayPal';
import { jwtPayload } from '../../components/PrivateRoute';
import { ColumnHead } from '../../components/Table/ColumnHead';
import { Table } from '../../components/Table/Table';
import { WATCH_SIZES, ORDER_STATUSES, ROLES, ORDER_STATUSES_TRANSLATE, WATCH_SIZES_TRANSLATE } from '../../constants';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { useSelector } from 'react-redux';

const defaultOrder = {
    masterId: null,
    cityId: null,
    watchSize: WATCH_SIZES.SMALL,
    date: '',
    time: null,
    rating: 0,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};

const defaultPagination = {
    page: 1,
    limit: 10
};
const defaultSortByField = {
    sortedField: 'date',
    isDirectedASC: false
};
const tableHeaders = [
    { value: 'master', title: 'Мастер', sortable: true },
    { value: 'watchSize', title: 'Размер часов', sortable: true },
    { value: 'date', title: 'Дата', sortable: true },
    { value: 'time', title: 'Время начала', sortable: true },
    { value: 'endTime', title: 'Время конца', sortable: true },
    { value: 'price', title: 'Цена', sortable: true },
    { value: 'status', title: 'Статус', sortable: true },
    { value: 'rating', title: 'Рейтинг', sortable: true },
    { value: 'payment', title: 'Оплата', sortable: false }
];

export const ClientOrders = () => {
    const [isFormOpened, setIsFormOpened] = useState(true);
    const [freeMasters, setFreeMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);

    const [orderId, setOrderId] = useState(null);
    const [isSetRatingOpened, setIsSetRatingOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [client, setClient] = useState({});
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [checkout, setCheckout] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        price: null,
        watchSize: '',
        orderId: null
    });

    const { id } = useSelector(state => ({
        id: state.auth.id
    }));

    const [fetchOrders, isLoading, Error] = useFetching(async () => {
        const clientId = id || jwtPayload(localStorage.getItem('token')).id;
        const orders = await ClientService.getClientOrders(clientId, { ...pagination, ...sortByField });
        setTotalPages(Math.ceil(orders.count / pagination.limit));
        setOrders(orders.rows);
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const clientId = id || jwtPayload(localStorage.getItem('token')).id;
        const client = await ClientService.getClientById(clientId);
        const cities = await CityService.getCities();

        setClient(client);
        setCities(cities.rows);
    });

    const findMasters = async (order) => {
        setOrder(order);
        const freeMasters = await MasterService.getFreeMasters(order.cityId, order.date, order.time, order.watchSize);
        setFreeMasters(freeMasters.sort((a, b) => b.rating - a.rating).map(master => master.rating && +master.rating !== 0 ? master : { ...master, rating: '-' }));
        setIsFormOpened(false);
    }

    const returnForm = () => {
        setIsFormOpened(true);
    }

    useEffect(() => {
        document.title = "Личный кабинет клиента - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [pagination, sortByField]);

    useEffect(() => {
        if (isModalOpened === false) {
            setIsSetRatingOpened(false);
            setOrder(defaultOrder);
            setIsFormOpened(true);
        }
    }, [isModalOpened]);

    const addOrder = async (chosenMaster) => {
        try {
            await OrderService.addOrder({ ...order, name: client.name, email: client.email, masterId: chosenMaster });
            setIsModalOpened(false);
            setIsFormOpened(true);
            notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно получен!');
            setOrder(defaultOrder);
            setIsFormOpened(true);
            fetchOrders();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const setRating = async (order) => {
        setIsSetRatingOpened(false);
        setIsModalOpened(false);
        try {
            await OrderService.setOrderRating(orderId, order.rating);
            setIsSetRatingOpened(false);
            setIsModalOpened(false);
            notify(NOTIFY_TYPES.SUCCESS, 'Рейтинг успешно выставлен!');
            fetchOrders();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }

    const createPayment = async (price, watchSize, orderId) => {
        setPaymentInfo({ price, watchSize, orderId });
        setCheckout(true);
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.CLIENT} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {
                        isSetRatingOpened
                            ?
                            <SetRatingForm onClick={setRating} />
                            :
                            isFormOpened && isModalOpened
                                ?
                                <ClientPersonalForm order={order} onClick={findMasters} btnTitle={'Добавить'} cities={cities}></ClientPersonalForm>
                                :
                                <MasterChoice freeMasters={freeMasters} returnForm={returnForm} price={order.price} addOrder={addOrder}></MasterChoice>
                    }
                </MyModal>

                <MyModal visible={checkout} setVisible={setCheckout}>
                    {checkout && <PayPal price={paymentInfo.price} watchSize={paymentInfo.watchSize} orderId={paymentInfo.orderId} setCheckout={setCheckout} onApprove={fetchOrders} />}
                </MyModal>

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
                            <td>{order.master}</td>
                            <td>{WATCH_SIZES_TRANSLATE[order.watchSize]}</td>
                            <td>{order.date}</td>
                            <td>{order.time}</td>
                            <td>{order.endTime}</td>
                            <td>{order.price}</td>
                            <td>{ORDER_STATUSES_TRANSLATE[order.status]}</td>
                            <td className='tableLink' onClick={!order.rating && order.status === ORDER_STATUSES.COMPLETED
                                ? () => { setOrderId(order.id); setIsSetRatingOpened(true); setIsModalOpened(true) }
                                : () => { }}>{order.status === ORDER_STATUSES.CANCELED ? '-'
                                    : order.status === ORDER_STATUSES.COMPLETED ? !order.rating
                                        ? <span>Выставить</span> : order.rating : '-'}</td>
                            <td className='tableLink' onClick={order.status === ORDER_STATUSES.AWAITING_PAYMENT
                                ? (() => createPayment(order.price, WATCH_SIZES_TRANSLATE[order.watchSize], order.id))
                                : () => { }}>{order.status !== ORDER_STATUSES.AWAITING_PAYMENT
                                    ? order.status === ORDER_STATUSES.CANCELED ? '-' : `\u2714` : <span>Оплатить</span>}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>

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
