import React, { useEffect, useState } from 'react';
import { AuthService, CityService, MasterService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { Navigate } from 'react-router-dom';
import { MasterForm } from '../../components/Forms/MasterForm';
import { Table } from '../../components/Table/Table';

const defaultMaster = {
    name: '',
    cities: []
};

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [currentMaster, setCurrentMaster] = useState(defaultMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        let masters = await MasterService.getMasters();

        masters = masters.map(m => {
            ['createdAt', 'updatedAt'].forEach((k) => {
                delete m[k];
            });
            return m;
        });

        setMasters(masters);
    });

    useEffect(() => {
        document.title = "Мастера - Clockwise Clockware";

        const checkAuth = async () => {
            try {
                await AuthService.checkAuth();
                const cities = await CityService.getCities();
                setCities(cities);
                fetchMasters();
            } catch (e) {
                setRedirect(true);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentMaster(null);
    }, [isModalOpened]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteMaster = async (id) => {
        try {
            await MasterService.deleteMasterById(id);
            fetchMasters();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const addMaster = async (master) => {
        try {
            await MasterService.addMaster(master);
            setIsModalOpened(false);
            fetchMasters();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const updateMaster = async (master) => {
        try {
            await MasterService.updateMasterById(master);
            setIsModalOpened(false);
            fetchMasters();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Имя", "Города", "Рейтинг", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `name`,
        `cities`,
        `rating`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentMaster(masters.find(c => c.id === id)) },
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
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentMaster(defaultMaster) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentMaster && <MasterForm values={currentMaster} onClick={currentMaster.id ? updateMaster : addMaster} cities={cities} btnTitle={currentMaster.id ? 'Изменить' : 'Добавить'}></MasterForm>}
                </MyModal>

                <Table
                    data={masters.map(m => ({ ...m, cities: m.cities.map(mc => cities.find(c => c.id === mc)?.name).join(', ') }))}
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
