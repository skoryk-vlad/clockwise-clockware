import React, { useEffect, useState } from 'react';
import { CityMasterService, CityService, MasterService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { Table } from '../../components/Table/Table';
import { CityMasterForm } from '../../components/Forms/CityMasterForm';

const defaultCityMaster = {
    cityId: null,
    masterId: null
};

export const CityMasters = () => {
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [cityMasters, setCityMasters] = useState([]);

    const [currentCityMaster, setCurrentCityMaster] = useState(defaultCityMaster);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [fetchCityMasters, isCitiesLoading, Error] = useFetching(async () => {
        const cityMasters = await CityMasterService.getCityMasters();

        setCityMasters(cityMasters);
    });
    const [fetchAdditionalData] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();

        setCities(cities);
        setMasters(masters);
    });

    useEffect(() => {
        document.title = "Города и мастера - Clockwise Clockware";
        fetchAdditionalData();
        fetchCityMasters();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
        setCurrentCityMaster(null);
    }, [isModalOpened]);

    const deleteCityMaster = async (id) => {
        try {
            await CityMasterService.deleteCityMasterById(id);
            fetchCityMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const addCityMaster = async (city) => {
        try {
            await CityMasterService.addCityMaster(city);
            setIsModalOpened(false);
            fetchCityMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const updateCityMaster = async (city) => {
        try {
            await CityMasterService.updateCityMasterById(city);
            setIsModalOpened(false);
            fetchCityMasters();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Город", "Мастер", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `City.name`,
        `Master.name`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentCityMaster(cityMasters.find(cityMaster => cityMaster.id === id)) },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteCityMaster,
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Города</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentCityMaster(defaultCityMaster) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentCityMaster && <CityMasterForm cityMaster={currentCityMaster}
                    cities={cities} masters={masters}
                    onClick={currentCityMaster.id ? updateCityMaster : addCityMaster}
                    btnTitle={currentCityMaster.id ? 'Изменить' : 'Добавить'}></CityMasterForm>}
                </MyModal>

                <Table
                    data={cityMasters}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {cityMasters.length === 0 && !isCitiesLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isCitiesLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
