import React, { useEffect, useState } from 'react';
import Server from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { BlueButton } from '../../components/BlueButton/BlueButton';

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
                    <BlueButton onClick={() => addClient()}>Добавить</BlueButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} placeholder="Имя клиента..." />
                    <MyInput value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} placeholder="Почта клиента..." />
                    <BlueButton onClick={() => updateClient()}>Изменить</BlueButton>
                </MyModal>

                <table className='admin-body__table'>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>email</th>
                            <th>Изменение</th>
                            <th>Удаление</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Error &&
                            <h1>Произошла ошибка ${Error}</h1>
                        }
                        {clients.map(client => 
                            <tr key={client.id} id={client.id}>
                                <td>{client.id}</td>
                                <td>{client.name}</td>
                                <td>{client.email}</td>
                                <td className='admin-body__link'><span onClick={e => {setModalUpd(true); setIdUpd(e.target.closest('tr').id)}}>Изменить</span></td>
                                <td className='admin-body__link'><span onClick={e => deleteClient(e)}>Удалить</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                        {isClientsLoading &&
                            <Loader />
                        }

            </div>
        </div>
    )
}
