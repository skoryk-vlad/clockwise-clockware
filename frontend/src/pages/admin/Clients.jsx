import React, { useEffect, useState } from 'react';
import { AuthService, ClientService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { Navigate } from 'react-router-dom';
import { ClientForm } from '../../components/Forms/ClientForm';
import { Table } from '../../components/Table/Table';

const defaultClient = {
    name: '',
    email: ''
};

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [currentClient, setCurrentClient] = useState(defaultClient);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        let clients = await ClientService.getClients(localStorage.getItem('token'));

        clients = clients.map(c => {
            ['createdAt', 'updatedAt'].forEach((k) => {
                delete c[k];
            });
            return c;
        });

        setClients(clients);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";

        const checkAuth = async () => {
            try {
                await AuthService.checkAuth();
                fetchClients();
            } catch (e) {
                setRedirect(true);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentClient(null);
    }, [isModalOpened]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteClient = async (id) => {
        try {
            await ClientService.deleteClientById(id);
            fetchClients();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const addClient = async (client) => {
        try {
            await ClientService.addClient(client);
            setIsModalOpened(false);
            fetchClients();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const updateClient = async (client) => {
        try {
            await ClientService.updateClientById(client);
            setIsModalOpened(false);
            fetchClients();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Имя", "Почта", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `name`,
        `email`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentClient(clients.find(c => c.id === id)) },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteClient,
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Клиенты</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentClient(defaultClient) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentClient && <ClientForm values={currentClient} onClick={currentClient.id ? updateClient : addClient} btnTitle={currentClient.id ? 'Изменить' : 'Добавить'}></ClientForm>}
                </MyModal>

                <Table
                    data={clients}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal>

                {isClientsLoading &&
                    <Loader />
                }
                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {clients.length === 0 && !isClientsLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
            </div>
        </div>
    )
}
