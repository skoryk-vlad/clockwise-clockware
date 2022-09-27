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
import { ColumnHead } from '../../components/Table/ColumnHead';

const defaultClient = {
    name: '',
    email: '',
    status: CLIENT_STATUSES.CONFIRMED
};

const defaultSortByField = {
    sortedField: 'id',
    isDirectedASC: true
};
const defaultPagination = {
    page: 1,
    limit: 10
};
const tableHeaders = [
    { value: 'id', title: 'id', sortable: true },
    { value: 'name', title: 'Имя', sortable: true },
    { value: 'email', title: 'Почта', sortable: true },
    { value: 'status', title: 'Статус', sortable: true },
    { value: 'change', title: 'Изменение', sortable: false },
    { value: 'delete', title: 'Удаление', sortable: false },
    { value: 'reset', title: 'Сброс пароля', sortable: false }
];

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [currentClient, setCurrentClient] = useState(defaultClient);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [clientEmailToReset, setClientEmailToReset] = useState(null);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await ClientService.getClients({ ...pagination, ...sortByField });
        setTotalPages(Math.ceil(clients.count / pagination.limit));
        setClients(clients.rows);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";
        fetchClients();
    }, []);

    useEffect(() => {
        fetchClients();
    }, [pagination, sortByField]);

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
                                key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                onClick={tableHeader.sortable &&
                                    (sortedField => sortByField.sortedField === sortedField
                                        ? setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC })
                                        : setSortByField({ sortedField: sortedField, isDirectedASC: true }))} />)}
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
