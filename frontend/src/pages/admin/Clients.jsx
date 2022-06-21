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

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [newClient, setNewClient] = useState({
        name: '',
        email: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await Server.getClients();

        setClients(clients);
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const deleteClient = async (event) => {
        const id = event.target.closest('tr').id;
        await Server.deleteClientById(id);
        fetchClients();
    }
    const addClient = async () => {
        await Server.addClient(newClient);
        setModalAdd(false);
        setNewClient({
            name: '',
            email: ''
        });
        fetchClients();
    }
    const updateClient = async () => {
        await Server.updateClientById(idUpd, newClient);
        setModalUpd(false);
        setNewClient({
            name: '',
            email: ''
        });
        fetchClients();
    }

    return (
        <div className='admin-container'>
            {/* <Helmet>
                <title>Клиенты - Clockwise Clockware</title>
            </Helmet> */}
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Клиенты</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>
                <MyModal visible={modalAdd} setVisible={setModalAdd}>
                    <MyInput value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Имя клиента..." />
                    <MyInput value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="Почта клиента..." />
                    <OrderButton onClick={() => addClient()}>Добавить</OrderButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Имя клиента..." />
                    <MyInput value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="Почта клиента..." />
                    <OrderButton onClick={() => updateClient()}>Изменить</OrderButton>
                </MyModal>

                <AdminTable dataArr={clients} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteClient(e)} />

                {isClientsLoading &&
                    <Loader />
                }
                {Error &&
                    <h2>Произошла ошибка ${Error}</h2>
                }
                {clients.length === 0 &&
                    <h2>Отсутствуют записи</h2>
                }
            </div>
        </div>
    )
}
