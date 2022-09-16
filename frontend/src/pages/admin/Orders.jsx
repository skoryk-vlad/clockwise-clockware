import React, { useEffect, useState } from 'react';
import { CityService, ClientService, OrderService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { OrderForm } from '../../components/Forms/OrderForm';
import { Table } from '../../components/Table/Table';
import { ORDER_STATUSES, WATCH_SIZES } from '../../constants.ts';

const defaultOrder = {
    clientId: null,
    masterId: null,
    cityId: null,
    watchSize: Object.keys(WATCH_SIZES)[0],
    date: '',
    time: null,
    rating: 0,
    status: Object.keys(ORDER_STATUSES)[0]
};

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [clients, setClients] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        let orders = await OrderService.getOrders();
        setOrders(orders);
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        const clients = await ClientService.getClients();

        setCities(cities);
        setClients(clients);
    });

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";
        fetchAdditionalData();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentOrder(null);
    }, [isModalOpened]);

    const deleteOrder = async (id) => {
        try {
            await OrderService.deleteOrderById(id);
            fetchOrders();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const addOrder = async (order) => {
        try {
            const client = clients.find(client => client.id === order.clientId);
            await OrderService.addOrder({ ...order, name: client.name, email: client.email });
            setIsModalOpened(false);
            fetchOrders();
            return true;
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const updateOrder = async (order) => {
        try {
            await OrderService.updateOrderById(order);
            setIsModalOpened(false);
            fetchOrders();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Размер часов", "Дата", "Время", "Рейтинг", "Город", "Клиент", "Мастер", "Статус", "Цена", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `watchSize`,
        `date`,
        `time`,
        `rating`,
        `City.name`,
        `Client.name`,
        `Master.name`,
        `status`,
        `price`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentOrder(orders.find(order => order.id === id)); },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteOrder,
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role='admin' />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentOrder(defaultOrder) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentOrder && <OrderForm order={currentOrder} onClick={currentOrder?.id ? updateOrder : addOrder}
                        clients={clients} cities={cities} btnTitle={currentOrder?.id ? 'Изменить' : 'Добавить'}></OrderForm>}
                </MyModal>

                <Table
                    data={orders.map(order => ({...order, status: ORDER_STATUSES[order.status], watchSize: WATCH_SIZES[order.watchSize]}))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal>

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
