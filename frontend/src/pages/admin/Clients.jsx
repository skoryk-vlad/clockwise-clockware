import React, { useEffect, useState } from 'react';
import { ClientService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
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

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await ClientService.getClients();

        setClients(clients);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";
        fetchClients();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentClient(null);
    }, [isModalOpened]);

    const deleteClient = async (id) => {
        try {
            await ClientService.deleteClientById(id);
            fetchClients();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const addClient = async (client) => {
        try {
            await ClientService.addClient(client);
            setIsModalOpened(false);
            fetchClients();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const updateClient = async (client) => {
        try {
            await ClientService.updateClientById(client);
            setIsModalOpened(false);
            fetchClients();
        } catch (error) {
            console.log(error.response.data);
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
            callback: id => { setIsModalOpened(true); setCurrentClient(clients.find(client => client.id === id)) },
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
                    {currentClient && <ClientForm client={currentClient} onClick={currentClient.id ? updateClient : addClient} btnTitle={currentClient.id ? 'Изменить' : 'Добавить'}></ClientForm>}
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
