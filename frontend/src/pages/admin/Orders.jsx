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
import { ColumnHead } from '../../components/Table/ColumnHead';
import { OrderFilterForm } from '../../components/Forms/OrderFilterForm';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
};

const defaultOrder = {
    clientId: null,
    masterId: null,
    cityId: null,
    watchSize: WATCH_SIZES.SMALL,
    date: '',
    time: null,
    rating: 0,
    status: ORDER_STATUSES.AWAITING_PAYMENT
};

const defaultFilters = {
    masters: [],
    clients: [],
    cities: [],
    statuses: [],
    dateStart: '',
    dateEnd: '',
    priceRange: [50, 300]
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
    { value: 'id', title: 'id', sortable: true },
    { value: 'watchSize', title: 'Размер часов', sortable: true },
    { value: 'date', title: 'Дата', sortable: true },
    { value: 'time', title: 'Время', sortable: true },
    { value: 'rating', title: 'Рейтинг', sortable: true },
    { value: 'city', title: 'Город', sortable: true },
    { value: 'client', title: 'Клиент', sortable: true },
    { value: 'master', title: 'Мастер', sortable: true },
    { value: 'status', title: 'Статус', sortable: true },
    { value: 'price', title: 'Цена', sortable: true },
    { value: 'images', title: 'Фото', sortable: false },
    { value: 'change', title: 'Изменение', sortable: false },
    { value: 'delete', title: 'Удаление', sortable: false }
];

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [clients, setClients] = useState([]);
    const [masters, setMasters] = useState([]);
    const [prices, setPrices] = useState([0, 0]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [filters, setFilters] = useState(defaultFilters);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [imageUrls, setImageUrls] = useState([]);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrders({ ...filters, ...pagination, ...sortByField });
        setTotalPages(Math.ceil(orders.count / pagination.limit));
        setOrders(orders.rows);
    });
    const [fetchAdditionalData, isAdditionalDataLoading] = useFetching(async () => {
        const cities = await CityService.getCities();
        const clients = await ClientService.getClients();
        const masters = await MasterService.getMasters();
        const prices = await OrderService.getMinAndMaxPrices();

        setCities(cities.rows);
        setClients(clients.rows);
        setMasters(masters.rows);
        setPrices([prices.min, prices.max]);
    });

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [filters, pagination, sortByField]);

    useEffect(() => {
        if (totalPages && pagination.page > totalPages)
            setPagination({ ...pagination, page: totalPages });
    }, [totalPages]);

    useEffect(() => {
        if (Error)
            setOrders([]);
    }, [Error]);

    useEffect(() => {
        if (!isModalOpened) {
            setCurrentOrder(null);
            setImageUrls([]);
        }
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
                    {!isAdditionalDataLoading && <OrderFilterForm filters={{
                        ...defaultFilters,
                        masters: Array.isArray(defaultFilters.masters) ? defaultFilters.masters.map(masterId => ({ value: masterId, label: masters.find(master => masterId === master.id)?.name })) : [],
                        cities: Array.isArray(defaultFilters.cities) ? defaultFilters.cities.map(cityId => ({ value: cityId, label: cities.find(city => cityId === city.id)?.name })) : [],
                        statuses: Array.isArray(defaultFilters.statuses) ? defaultFilters.statuses.map(status => ({ value: status, label: ORDER_STATUSES_TRANSLATE[status] })) : []
                    }}
                        onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && setFilters(newFilterState); }}
                        cities={cities} prices={prices} masters={masters} setFilters={setFilters}></OrderFilterForm>}

                    <div className="admin-body__btns">
                        <AdminButton onClick={() => { setIsModalOpened(true); setCurrentOrder(defaultOrder) }}>
                            Добавить
                        </AdminButton>
                        <AdminButton onClick={async () => await OrderService.createReport({ ...filters, ...sortByField })}>
                            Экспорт
                        </AdminButton>
                    </div>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentOrder && <OrderForm order={currentOrder} onClick={currentOrder?.id ? updateOrder : addOrder}
                        clients={clients} cities={cities} btnTitle={currentOrder?.id ? 'Изменить' : 'Добавить'}></OrderForm>}
                    {imageUrls.length > 0 && <Slider {...settings} className='carousel'>
                        {imageUrls.map((imageUrl, index) => <div className='carousel_item' key={index}><img src={imageUrl} alt='Фото заказа' /></div>)}
                    </Slider>}
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
                            <td>{order.id}</td>
                            <td>{WATCH_SIZES_TRANSLATE[order.watchSize]}</td>
                            <td>{order.date}</td>
                            <td>{order.time}</td>
                            <td>{order.rating}</td>
                            <td>{order.city}</td>
                            <td>{order.client}</td>
                            <td>{order.master}</td>
                            <td>{ORDER_STATUSES_TRANSLATE[order.status]}</td>
                            <td>{order.price}</td>
                            <td className='tableLink' onClick={order.imagesLinks && order.imagesLinks.length ? () => { setImageUrls(order.imagesLinks); setIsModalOpened(true); } : () => {}}>
                                {order.imagesLinks && order.imagesLinks.length ? <span>Смотреть</span> : '-'}</td>
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
