import React, { useEffect, useState } from 'react';
import { CityService, MasterService, ClientService, OrderService, AuthService, StatusService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { Navigate } from 'react-router-dom';
import { OrderForm } from '../../components/Forms/OrderForm';
import { Table } from '../../components/Table/Table';

const defaultOrder = {
    clientId: null,
    masterId: null,
    cityId: null,
    watchSize: null,
    date: '',
    time: null,
    rating: 0,
    statusId: 1
};

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [currentOrder, setCurrentOrder] = useState(defaultOrder);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        let orders = await OrderService.getOrders();

        setOrders(orders);
    });

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";

        const checkAuth = async () => {
            try {
                await AuthService.checkAuth();
                const cities = await CityService.getCities();
                const masters = await MasterService.getMasters();
                const clients = await ClientService.getClients();
                const statuses = await StatusService.getStatuses();

                setCities(cities);
                setMasters(masters);
                setClients(clients);
                setStatuses(statuses);

                fetchOrders();
            } catch (e) {
                setRedirect(true);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentOrder(null);
    }, [isModalOpened]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteOrder = async (id) => {
        try {
            await OrderService.deleteOrderById(id);
            fetchOrders();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const addOrder = async (order) => {
        try {
            const client = clients.find(c => c.id === order.clientId);
            await OrderService.addOrder({ ...order, name: client.name, email: client.email });
            setIsModalOpened(false);
            fetchOrders();
            return true;
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const updateOrder = async (order) => {
        try {
            await OrderService.updateOrderById(order);
            setIsModalOpened(false);
            fetchOrders();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Размер часов", "Дата", "Время", "Рейтинг", "Город", "Клиент", "Мастер", "Статус", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `watchSize`,
        `date`,
        `time`,
        `rating`,
        `City.name`,
        `Client.name`,
        `Master.name`,
        `Status.name`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentOrder(orders.find(c => c.id === id)); },
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
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentOrder(defaultOrder) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentOrder && <OrderForm values={currentOrder} onClick={currentOrder?.id ? updateOrder : addOrder}
                        masters={masters} clients={clients} statuses={statuses}
                        cities={cities} btnTitle={currentOrder?.id ? 'Изменить' : 'Добавить'}></OrderForm>}
                </MyModal>

                <Table
                    data={orders}
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
