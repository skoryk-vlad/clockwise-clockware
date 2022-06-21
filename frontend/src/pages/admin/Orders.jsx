import React, { useEffect, useState } from 'react';
import Server from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { OrderButton } from '../../components/OrderButton/OrderButton';
import { Helmet } from 'react-helmet';
import { AdminTable } from '../../components/AdminTable/AdminTable';

export const Orders = () => {
    const [orders, setOrders] = useState([]);

    const [newOrder, setNewOrder] = useState({
        client_id: '',
        master_id: '',
        city_id: '',
        watch_size: '',
        date: '',
        time: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await Server.getOrders();

        setOrders(orders);
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const deleteOrder = async (event) => {
        const id = event.target.closest('tr').id;
        await Server.deleteOrderById(id);
        fetchOrders();
    }
    const addOrder = async () => {
        console.log(parseInt(newOrder.time));
        console.log(newOrder);
        await Server.addOrder(newOrder);
        setModalAdd(false);
        setNewOrder({
            client_id: '',
            master_id: '',
            city_id: '',
            watch_size: '',
            date: '',
            time: ''
        });
        fetchOrders();
    }
    const updateOrder = async () => {
        await Server.updateOrderById(idUpd, newOrder);
        setModalUpd(false);
        setNewOrder({
            client_id: '',
            master_id: '',
            city_id: '',
            watch_size: '',
            date: '',
            time: ''
        });
        fetchOrders();
    }

    return (
        <div className='admin-container'>
            {/* <Helmet>
                <title>Заказы - Clockwise Clockware</title>
            </Helmet> */}
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>
                <MyModal visible={modalAdd} setVisible={setModalAdd}>
                    <MyInput value={newOrder.client_id} onChange={e => setNewOrder({...newOrder, client_id: e.target.value})} placeholder="id клиента..." />
                    <MyInput value={newOrder.master_id} onChange={e => setNewOrder({...newOrder, master_id: e.target.value})} placeholder="id мастера..." />
                    <MyInput value={newOrder.city_id} onChange={e => setNewOrder({...newOrder, city_id: e.target.value})} placeholder="id города..." />
                    <MyInput value={newOrder.watch_size} onChange={e => setNewOrder({...newOrder, watch_size: e.target.value})} placeholder="Размер часов..." />
                    <MyInput value={newOrder.date} onChange={e => setNewOrder({ ...newOrder, date: e.target.value })} type="date" placeholder="Дата..." />
                    <MyInput value={newOrder.time} onChange={e => setNewOrder({ ...newOrder, time: e.target.value })} type="time" placeholder="Время..." />
                    <OrderButton onClick={() => addOrder()}>Добавить</OrderButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                <MyInput value={newOrder.client_id} onChange={e => setNewOrder({...newOrder, client_id: e.target.value})} placeholder="id клиента..." />
                    <MyInput value={newOrder.master_id} onChange={e => setNewOrder({...newOrder, master_id: e.target.value})} placeholder="id мастера..." />
                    <MyInput value={newOrder.city_id} onChange={e => setNewOrder({...newOrder, city_id: e.target.value})} placeholder="id города..." />
                    <MyInput value={newOrder.watch_size} onChange={e => setNewOrder({...newOrder, watch_size: e.target.value})} placeholder="Размер часов..." />
                    <MyInput value={newOrder.date} onChange={e => setNewOrder({ ...newOrder, date: e.target.value })} type="date" placeholder="Дата..." />
                    <MyInput value={newOrder.time} onChange={e => setNewOrder({ ...newOrder, time: e.target.value })} type="time" placeholder="Время..." />
                    <OrderButton onClick={() => updateOrder()}>Изменить</OrderButton>
                </MyModal>

                <AdminTable dataArr={orders} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteOrder(e)} />

                {Error &&
                    <h2>Произошла ошибка ${Error}</h2>
                }
                {orders.length === 0 &&
                    <h2>Отсутствуют записи</h2>
                }
                {isOrdersLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
