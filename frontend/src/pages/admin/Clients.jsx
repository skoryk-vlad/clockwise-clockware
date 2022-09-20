import React, { useEffect, useState } from 'react';
import { ClientService, UserService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { ClientForm } from '../../components/Forms/ClientForm';
import { Table } from '../../components/Table/Table';
import { CLIENT_STATUSES, CLIENT_STATUSES_TRANSLATE, ROLES } from '../../constants';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';

const defaultClient = {
    name: '',
    email: '',
    status: CLIENT_STATUSES.CONFIRMED
};

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [currentClient, setCurrentClient] = useState(defaultClient);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [clientEmailToReset, setClientEmailToReset] = useState(null);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await ClientService.getClients();

        setClients(clients);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";
        fetchClients();
    }, []);

    useEffect(() => {
        if (!isModalOpened) {
            setCurrentClient(null);
            setClientEmailToReset(null);
        }
    }, [isModalOpened]);

    const deleteClient = async (id) => {
        try {
            await ClientService.deleteClientById(id);
            notify(NOTIFY_TYPES.SUCCESS, 'Клиент успешно удален');
            fetchClients();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const resetClientPassword = async (email) => {
        try {
            await UserService.resetPassword(email);
            notify(NOTIFY_TYPES.SUCCESS, 'Пароль успешно сброшен');
            setIsModalOpened(false);
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const addClient = async (client) => {
        try {
            await ClientService.addClientByAdmin(client);
            notify(NOTIFY_TYPES.SUCCESS, 'Клиент успешно добавлен');
            setIsModalOpened(false);
            fetchClients();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const updateClient = async (client) => {
        try {
            await ClientService.updateClientById(client);
            notify(NOTIFY_TYPES.SUCCESS, 'Клиент успешно изменен');
            setIsModalOpened(false);
            fetchClients();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }

    const tableHeaders = ["id", "Имя", "Почта", "Статус", "Изменение", "Удаление", "Сброс пароля"];

    const tableBodies = [
        `id`,
        `name`,
        `email`,
        `status`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentClient(clients.find(client => client.id === id)) },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteClient,
            param: `id`
        },
        {
            name: `Сбросить`,
            callback: email => { setIsModalOpened(true); setClientEmailToReset(email) },
            param: `email`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Клиенты</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentClient(defaultClient) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentClient && <ClientForm client={currentClient} onClick={currentClient.id ? updateClient : addClient} btnTitle={currentClient.id ? 'Изменить' : 'Добавить'}></ClientForm>}
                    {clientEmailToReset && <ConfirmationModal text='Вы уверены, что хотите сбросить пароль пользователя?' onAccept={() => resetClientPassword(clientEmailToReset)} onReject={() => setIsModalOpened(false)} />}
                </MyModal>

                <Table
                    data={clients.map(order => ({ ...order, status: CLIENT_STATUSES_TRANSLATE[order.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

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
