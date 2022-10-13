import React, { useEffect, useState } from 'react';
import { ClientService, OrderService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { OrderForm } from '../../components/Forms/OrderForm';
import { ORDER_STATUSES, ORDER_STATUSES_TRANSLATE, ROLES, WATCH_SIZES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { Table } from '../../components/Table/Table';
import { ColumnHead } from '../../components/Table/ColumnHead';
import { OrderFilterForm } from '../../components/Forms/OrderFilterForm';
import { useSelector, useDispatch } from 'react-redux';
import { addOrderThunk, deleteOrderThunk, getOrdersMinAndMaxPricesThunk, getOrdersThunk, updateOrderThunk } from '../../store/orders/thunks';
import { setCurrentOrder, setFilters, setImageUrls, setIsModalOpened, setPagination, setSortByField } from '../../store/orders/slice';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
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
    const dispatch = useDispatch();

    const { orders, totalPages, filters, pagination, sortByField, isLoading, error, prices, currentOrder, isModalOpened, imageUrls } = useSelector(state => ({
        orders: state.orders.orders,
        filters: state.orders.filters,
        pagination: state.orders.pagination,
        sortByField: state.orders.sortByField,
        totalPages: state.orders.totalPages,
        isLoading: state.orders.isLoading,
        error: state.orders.error,
        prices: state.orders.priceBoundaries,
        currentOrder: state.orders.currentOrder,
        isModalOpened: state.orders.isModalOpened,
        imageUrls: state.orders.imageUrls
    }));

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";
        dispatch(getOrdersMinAndMaxPricesThunk());
    }, []);

    useEffect(() => {
        dispatch(getOrdersThunk());
    }, [filters, pagination, sortByField]);

    useEffect(() => {
        if (totalPages && pagination.page > totalPages)
            dispatch(setPagination({ ...pagination, page: totalPages }))
    }, [totalPages]);

    useEffect(() => {
        if (!isModalOpened) {
            dispatch(setCurrentOrder(null));
            dispatch(setImageUrls([]));
        }
    }, [isModalOpened]);

    const deleteOrder = async (id) => {
        const response = await dispatch(deleteOrderThunk(id));

        if (response.error) notify(NOTIFY_TYPES.ERROR);
        else notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно удален!');
    }
    const addOrder = async (order) => {
        const client = await ClientService.getClientById(order.clientId);
        const response = await dispatch(addOrderThunk({ ...order, name: client.name, email: client.email }));

        if (response.error) notify(NOTIFY_TYPES.ERROR);
        else notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно добавлен!');
    }
    const updateOrder = async (order) => {
        const response = await dispatch(updateOrderThunk(order));

        if (response.error) notify(NOTIFY_TYPES.ERROR);
        else notify(NOTIFY_TYPES.SUCCESS, 'Заказ успешно изменен!');
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>
                <div className='admin-body__top'>
                    <OrderFilterForm filters={filters}
                        onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && dispatch(setFilters(newFilterState)); }}
                        prices={prices}></OrderFilterForm>

                    <div className="admin-body__btns">
                        <AdminButton onClick={() => { dispatch(setIsModalOpened(true)); dispatch(setCurrentOrder(defaultOrder)) }}>
                            Добавить
                        </AdminButton>
                        <AdminButton onClick={async () => await OrderService.createReport({ ...filters, ...sortByField })}>
                            Экспорт
                        </AdminButton>
                    </div>
                </div>

                <MyModal visible={isModalOpened} setVisible={isModalOpened => dispatch(setIsModalOpened(isModalOpened))}>
                    {currentOrder && <OrderForm order={currentOrder} onClick={currentOrder?.id ? updateOrder : addOrder}
                        btnTitle={currentOrder?.id ? 'Изменить' : 'Добавить'}></OrderForm>}
                    {imageUrls.length > 0 && <Slider {...settings} className='carousel'>
                        {imageUrls.map((imageUrl, index) => <div className='carousel_item' key={index}><img src={imageUrl} alt='Фото заказа' /></div>)}
                    </Slider>}
                </MyModal>

                <Table changeLimit={limit => dispatch(setPagination({ ...pagination, limit }))}
                    changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && (dispatch(setPagination({ ...pagination, page: changeTo })))}
                    currentPage={pagination.page} totalPages={totalPages}>
                    <thead>
                        <tr>
                            {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                onClick={tableHeader.sortable &&
                                    (sortedField => sortByField.sortedField === sortedField
                                        ? dispatch(setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC }))
                                        : dispatch(setSortByField({ sortedField: sortedField, isDirectedASC: true })))} />)}
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
                            <td className='tableLink' onClick={order.imagesLinks && order.imagesLinks.length ? () => { dispatch(setImageUrls(order.imagesLinks)); dispatch(setIsModalOpened(true)); } : () => { }}>
                                {order.imagesLinks && order.imagesLinks.length ? <span>Смотреть</span> : '-'}</td>
                            <td className='tableLink' onClick={() => { dispatch(setIsModalOpened(true)); dispatch(setCurrentOrder(orders.find(orderToFind => orderToFind.id === order.id))) }}><span>Изменить</span></td>
                            <td className='tableLink' onClick={() => deleteOrder(order.id)}><span>Удалить</span></td>
                        </tr >
                        )}
                    </tbody >
                </Table >

                {error &&
                    <h2 className='adminError'>Произошла ошибка "{error}"</h2>
                }
                {
                    orders.length === 0 && !isLoading && !error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {
                    isLoading &&
                    <Loader />
                }
            </div >
        </div >
    )
}
