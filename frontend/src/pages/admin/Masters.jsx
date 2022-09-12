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

const defaultMaster = {
    name: ''
};

export const Masters = () => {
    const [masters, setMasters] = useState([]);

    const [currentMaster, setCurrentMaster] = useState(defaultMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters();
        setMasters(masters);
    });

    useEffect(() => {
        document.title = "Мастера - Clockwise Clockware";
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

    const tableHeaders = ["id", "Имя", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `name`,
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
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentMaster(defaultMaster) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentMaster && <MasterForm master={currentMaster} onClick={currentMaster.id ? updateMaster : addMaster} btnTitle={currentMaster.id ? 'Изменить' : 'Добавить'}></MasterForm>}
                </MyModal>

                <Table
                    data={masters}
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
