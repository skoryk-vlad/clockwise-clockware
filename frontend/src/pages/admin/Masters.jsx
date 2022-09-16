import React, { useEffect, useState } from 'react';
import { CityService, MasterService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { MasterForm } from '../../components/Forms/MasterForm';
import { Table } from '../../components/Table/Table';
import { MASTER_STATUSES } from '../../constants.ts';

const defaultMaster = {
    name: '',
    email: '',
    cities: [],
    status: Object.keys(MASTER_STATUSES)[2]
};

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [currentMaster, setCurrentMaster] = useState(defaultMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters();
        setMasters(masters.map(master => ({...master, cities: master.Cities.map(city => city.id)})));
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
        if (!isModalOpened)
            setCurrentMaster(null);
    }, [isModalOpened]);

    const deleteMaster = async (id) => {
        try {
            await MasterService.deleteMasterById(id);
            fetchMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const addMaster = async (master) => {
        try {
            await MasterService.addMaster(master);
            setIsModalOpened(false);
            fetchMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const updateMaster = async (master) => {
        try {
            await MasterService.updateMasterById(master);
            setIsModalOpened(false);
            fetchMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Имя", "Почта", "Города", "Рейтинг", "Статус", "Изменение", "Удаление"];

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
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar role='admin' />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentMaster(defaultMaster) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentMaster && <MasterForm master={currentMaster} onClick={currentMaster.id ? updateMaster : addMaster} cities={cities} btnTitle={currentMaster.id ? 'Изменить' : 'Добавить'}></MasterForm>}
                </MyModal>

                <Table
                    data={masters.map(master => ({ ...master, cities: master.cities.map(cityId => cities.find(city => city.id === cityId)?.name).join(', '), status: MASTER_STATUSES[master.status] }))}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal>

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
