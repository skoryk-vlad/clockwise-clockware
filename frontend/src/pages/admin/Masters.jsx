import React, { useEffect, useState } from 'react';
import { CityService, MasterService, UserService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { MasterForm } from '../../components/Forms/MasterForm';
import { Table } from '../../components/Table/Table';
import { MASTER_STATUSES, MASTER_STATUSES_TRANSLATE, ROLES } from '../../constants';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { notify, NOTIFY_TYPES } from '../../components/Notifications';

const defaultMaster = {
    name: '',
    email: '',
    cities: [],
    status: MASTER_STATUSES.APPROVED
};

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [currentMaster, setCurrentMaster] = useState(defaultMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [masterEmailToReset, setMasterEmailToReset] = useState(null);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters();
        setMasters(masters.map(master => ({ ...master, cities: master.Cities.map(city => city.id) })));
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities);
    });

    useEffect(() => {
        document.title = "Мастера - Clockwise Clockware";
        fetchAdditionalData();
        fetchMasters();
    }, []);

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

    const tableHeaders = ["id", "Имя", "Почта", "Города", "Рейтинг", "Статус", "Изменение", "Удаление", "Сброс пароля"];

    const tableBodies = [
        `id`,
        `name`,
        `email`,
        `cities`,
        `rating`,
        `status`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentMaster(masters.find(master => master.id === id)) },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteMaster,
            param: `id`
        },
        {
            name: `Сбросить`,
            callback: email => { setIsModalOpened(true); setMasterEmailToReset(email) },
            param: `email`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role={ROLES.ADMIN} />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentMaster(defaultMaster) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {masterEmailToReset && <ConfirmationModal text='Вы уверены, что хотите сбросить пароль пользователя?' onAccept={() => resetMasterPassword(masterEmailToReset)} onReject={() => setIsModalOpened(false)} />}
                    {currentMaster && <MasterForm master={currentMaster} onClick={currentMaster.id ? updateMaster : addMaster} cities={cities} btnTitle={currentMaster.id ? 'Изменить' : 'Добавить'}></MasterForm>}
                </MyModal>

                <Table
                    data={masters.map(master => ({ ...master, cities: master.cities.map(cityId => cities.find(city => city.id === cityId)?.name).join(', '), status: MASTER_STATUSES_TRANSLATE[master.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

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
