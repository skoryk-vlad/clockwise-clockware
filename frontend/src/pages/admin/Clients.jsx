import React, { useEffect, useState } from 'react';
import { ClientService, UserService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { ClientForm } from '../../components/Forms/ClientForm';
import { CLIENT_STATUSES, CLIENT_STATUSES_TRANSLATE, ROLES } from '../../constants';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { Table } from '../../components/Table/Table';
import { ColumnHead, sortByColumn } from '../../components/Table/ColumnHead';

const defaultClient = {
    name: '',
    email: '',
    status: CLIENT_STATUSES.CONFIRMED
};

const defaultsortState = {
    value: 'id',
    isDirectedASC: true
};
const defaultPagination = {
    page: 1,
    limit: 10
};
const tableHeaders = [
    { value: 'id', title: 'id', clickable: true },
    { value: 'name', title: 'Имя', clickable: true },
    { value: 'price', title: 'Почта', clickable: true },
    { value: 'status', title: 'Статус', clickable: true },
    { value: 'change', title: 'Изменение', clickable: false },
    { value: 'delete', title: 'Удаление', clickable: false },
    { value: 'reset', title: 'Сброс пароля', clickable: false }
];

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [currentClient, setCurrentClient] = useState(defaultClient);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortState, setSortState] = useState(defaultsortState);

    const [clientEmailToReset, setClientEmailToReset] = useState(null);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await ClientService.getClients(pagination);
        setTotalPages(Math.ceil(clients.count / pagination.limit));
        sortByColumn(clients.rows, sortState.value, sortState.isDirectedASC, setClients);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";
        fetchClients();
    }, []);

    useEffect(() => {
        fetchClients();
    }, [pagination]);

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

                <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })}
                    changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                    currentPage={pagination.page} totalPages={totalPages}>
                    <thead>
                        <tr>
                            {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} onClick={tableHeader.clickable && (value => {
                                    sortByColumn(clients, value, sortState.value === value ? !sortState.isDirectedASC : true, setClients);
                                    sortState.value === value ? setSortState({ value, isDirectedASC: !sortState.isDirectedASC }) : setSortState({ value, isDirectedASC: true })
                                })}
                                clickable={tableHeader.clickable} sortState={sortState} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{CLIENT_STATUSES_TRANSLATE[client.status]}</td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentClient(clients.find(clientToFind => clientToFind.id === client.id)) }}><span>Изменить</span></td>
                            <td className='tableLink' onClick={() => deleteClient(client.id)}><span>Удалить</span></td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setClientEmailToReset(client.email) }}><span>Сбросить</span></td>
                        </tr>
                        )}
                    </tbody>
                </Table>

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
