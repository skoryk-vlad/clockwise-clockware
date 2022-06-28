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
import { MySelect } from '../../components/select/MySelect';
import { NumPicker } from '../../components/NumPicker/NumPicker';

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);

    const [newOrder, setNewOrder] = useState({
        client: 1,
        master: 1,
        city: 1,
        watch_size: 1,
        date: '',
        time: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updOrder, setUpdOrder] = useState({
        client: 1,
        master: 1,
        city: 1,
        watch_size: 1,
        date: '',
        time: ''
    });
    
    const checkZero = (num) => {
        return num > 9 ? num : '0' + num;
    };
    const date = new Date();
    const minDate = `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;

    const toDate = (strDate) => {
        const date = new Date(strDate);

        return `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;
    }

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await Server.getOrders();
        const cities = await Server.getCities();
        const masters = await Server.getMasters();
        const clients = await Server.getClients();

        setOrders(orders.map(o => ({...o, date: toDate(o.date)})));
        setCities(cities);
        setMasters(masters);
        setClients(clients);
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if(idUpd) {
            setUpdOrder(orders.find(o => o.id === +idUpd));
        }
    }, [idUpd]);

    const deleteOrder = async (event) => {
        const id = event.target.closest('tr').id;
        await Server.deleteOrderById(id);
        fetchOrders();
    }
    const addOrder = async () => {
        await Server.addOrder(newOrder);
        setModalAdd(false);
        setNewOrder({
            client: 1,
            master: 1,
            city: 1,
            watch_size: 1,
            date: '',
            time: ''
        });
        fetchOrders();
    }
    const updateOrder = async () => {
        await Server.updateOrderById(idUpd, updOrder);
        setModalUpd(false);
        setUpdOrder({
            client: 1,
            master: 1,
            city: 1,
            watch_size: 1,
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
                    <MySelect
                        value={newOrder.client} onChange={e => setNewOrder({...newOrder, client: e})}
                        options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                    />
                    <MySelect
                        value={newOrder.city} onChange={e => setNewOrder({...newOrder, city: e})}
                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                    />
                    <MySelect
                        value={newOrder.master} onChange={e => setNewOrder({...newOrder, master: e})}
                        options={masters.filter((master => (master.city === cities[newOrder.city - 1].name))).map(master => ({ value: master.id, name: master.name }))}
                    />
                    <NumPicker from='1' to='3'
                                value={newOrder.watch_size} onClick={e => setNewOrder({...newOrder, watch_size: +e.target.dataset.num})} />
                    <MyInput value={newOrder.date} min={minDate} onChange={e => setNewOrder({ ...newOrder, date: e.target.value })} type="date" placeholder="Дата..." />
                    <NumPicker min={newOrder.date === minDate ? date.getHours() + 1 : 0}
                                from='10' to='18' count={newOrder.watch_size}
                                value={newOrder.time} onClick={e => setNewOrder({...newOrder, time: e.target.dataset.num})} /> 
                    <OrderButton onClick={() => addOrder()}>Добавить</OrderButton>
                </MyModal>
                
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MySelect
                        value={clients.find(c => c.name === updOrder.client)?.id} onChange={e => setUpdOrder({...updOrder, client: e})}
                        options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                    />
                    <MySelect
                        value={cities.find(c => c.name === updOrder.city)?.id} onChange={e => setUpdOrder({...updOrder, city: e})}
                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                    />
                    <MySelect
                        value={masters.find(m => m.name === updOrder.master)?.id} onChange={e => setUpdOrder({...updOrder, master: e})}
                        options={masters.map(master => ({ value: master.id, name: master.name }))}
                    />
                    {/* {options={masters.filter((master => master.city === updOrder.city)).map(master => ({ value: master.id, name: master.name }))}} */}
                    
                    <NumPicker from='1' to='3'
                                value={updOrder.watch_size} onClick={e => setUpdOrder({...updOrder, watch_size: +e.target.dataset.num})} />
                    <MyInput value={updOrder.date} min={minDate} onChange={e => setUpdOrder({ ...updOrder, date: e.target.value })} type="date" placeholder="Дата..." />
                    <NumPicker min={updOrder.date === minDate ? date.getHours() + 1 : 0}
                                from='10' to='18' count={updOrder.watch_size}
                                value={updOrder.time} onClick={e => setUpdOrder({...updOrder, time: +e.target.dataset.num})} /> 
                    <OrderButton onClick={() => updateOrder()}>Изменить</OrderButton>
                </MyModal>

                <AdminTable dataArr={orders} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteOrder(e)} />

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
