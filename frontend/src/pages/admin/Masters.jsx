import React, { useEffect, useState } from 'react';
import { CityService, MasterService, UserService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { MasterForm } from '../../components/Forms/MasterForm';
import { MASTER_STATUSES, MASTER_STATUSES_TRANSLATE, ROLES } from '../../constants';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';
import { Table } from '../../components/Table/Table';
import { ColumnHead, sortByColumn } from '../../components/Table/ColumnHead';
import { MasterFilterForm } from '../../components/Forms/MasterFilterForm';

const defaultMaster = {
    name: '',
    email: '',
    cities: [],
    status: MASTER_STATUSES.APPROVED
};
const defaultFilters = {
    cities: [],
    statuses: []
};
const defaultPagination = {
    page: 1,
    limit: 10
};
const defaultSortByField = {
    value: 'id',
    isDirectedASC: true
};
const tableHeaders = [
    { value: 'id', title: 'id', sortable: true },
    { value: 'name', title: 'Имя', sortable: true },
    { value: 'email', title: 'Почта', sortable: true },
    { value: 'cities', title: 'Города', sortable: true },
    { value: 'status', title: 'Статус', sortable: true },
    { value: 'change', title: 'Изменение', sortable: false },
    { value: 'delete', title: 'Удаление', sortable: false },
    { value: 'reset', title: 'Сброс пароля', sortable: false }
];

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [currentMaster, setCurrentMaster] = useState(defaultMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [masterEmailToReset, setMasterEmailToReset] = useState(null);

    const [pagination, setPagination] = useState(defaultPagination);
    const [filters, setFilters] = useState(defaultFilters);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters({ ...filters, ...pagination });
        setTotalPages(Math.ceil(masters.count / pagination.limit));
        sortByColumn(masters.rows.map(master => ({...master, cities: master.Cities.map(city => city.id)})), sortByField.value, sortByField.isDirectedASC, setMasters);
    });

    const [fetchAdditionalData, isCitiesLoading] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities.rows);
    });

    useEffect(() => {
        document.title = "Мастера - Clockwise Clockware";
        fetchAdditionalData();
        fetchMasters();
    }, []);

    useEffect(() => {
        fetchMasters();
    }, [filters, pagination]);

    useEffect(() => {
        if (Error)
            setMasters([]);
    }, [Error]);

    useEffect(() => {
        if (!isModalOpened) {
            setCurrentMaster(null);
            setMasterEmailToReset(null);
        }
    }, [isModalOpened]);

    const deleteMaster = async (id) => {
        try {
            await MasterService.deleteMasterById(id);
            notify(NOTIFY_TYPES.SUCCESS, 'Мастер успешно удален');
            fetchMasters();
        } catch (error) {
            if (error.response.data === 'The master has orders')
                notify(NOTIFY_TYPES.ERROR, 'У данного мастера есть заказы. Его удаление невозможно!');
            else
                notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const resetMasterPassword = async (email) => {
        try {
            await UserService.resetPassword(email);
            notify(NOTIFY_TYPES.SUCCESS, 'Пароль успешно сброшен');
            setIsModalOpened(false);
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const addMaster = async (master) => {
        try {
            await MasterService.addMasterByAdmin(master);
            notify(NOTIFY_TYPES.SUCCESS, 'Мастер успешно добавлен');
            setIsModalOpened(false);
            fetchMasters();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const updateMaster = async (master) => {
        try {
            await MasterService.updateMasterById(master);
            notify(NOTIFY_TYPES.SUCCESS, 'Мастер успешно изменен');
            setIsModalOpened(false);
            fetchMasters();
        } catch (error) {
            notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>
                <div className='admin-body__top'>
                    {!isCitiesLoading && <MasterFilterForm filters={{
                        ...defaultFilters,
                        cities: Array.isArray(defaultFilters.cities) ? defaultFilters.cities.map(cityId => ({ value: cityId, label: cities.find(city => cityId === city.id)?.name })) : [],
                        statuses: Array.isArray(defaultFilters.statuses) ? defaultFilters.statuses.map(status => ({ value: status, label: MASTER_STATUSES_TRANSLATE[status] })) : []
                    }}
                        onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && setFilters(newFilterState); }}
                        cities={cities} setFilters={setFilters}></MasterFilterForm>}

                    <div className="admin-body__btns">
                        <AdminButton onClick={() => { setIsModalOpened(true); setCurrentMaster(defaultMaster) }}>
                            Добавить
                        </AdminButton>
                    </div>
                </div>
                
                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {masterEmailToReset && <ConfirmationModal text='Вы уверены, что хотите сбросить пароль пользователя?' onAccept={() => resetMasterPassword(masterEmailToReset)} onReject={() => setIsModalOpened(false)} />}
                    {currentMaster && <MasterForm master={currentMaster} onClick={currentMaster.id ? updateMaster : addMaster} cities={cities} btnTitle={currentMaster.id ? 'Изменить' : 'Добавить'}></MasterForm>}
                </MyModal>

                <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })}
                    changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                    currentPage={pagination.page} totalPages={totalPages}>
                    <thead>
                        <tr>
                            {tableHeaders.map(tableHeader => <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} onClick={tableHeader.sortable && (value => {
                                    sortByColumn(masters, value, sortByField.value === value ? !sortByField.isDirectedASC : true, setMasters);
                                    sortByField.value === value ? setSortByField({ value, isDirectedASC: !sortByField.isDirectedASC }) : setSortByField({ value, isDirectedASC: true })
                                })}
                                sortable={tableHeader.sortable} sortByField={sortByField} />)}
                        </tr>
                    </thead>
                    <tbody>
                        {masters.map(master => <tr key={master.id}>
                            <td>{master.id}</td>
                            <td>{master.name}</td>
                            <td>{master.email}</td>
                            <td>{master.Cities.map(city => city.name).join(', ')}</td>
                            <td>{MASTER_STATUSES_TRANSLATE[master.status]}</td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setCurrentMaster(masters.find(masterToFind => masterToFind.id === master.id)) }}><span>Изменить</span></td>
                            <td className='tableLink' onClick={() => deleteMaster(master.id)}><span>Удалить</span></td>
                            <td className='tableLink' onClick={() => { setIsModalOpened(true); setMasterEmailToReset(master.email) }}><span>Сбросить</span></td>
                        </tr>
                        )}
                    </tbody>
                </Table>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {masters.length === 0 && !isMastersLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isMastersLoading &&
                    <Loader />
                }

            </div>
        </div>
    )
}
