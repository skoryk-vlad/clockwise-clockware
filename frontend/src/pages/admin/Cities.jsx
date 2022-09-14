import React, { useEffect, useState } from 'react';
import { CityService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { CityForm } from '../../components/Forms/CityForm';
import { Table } from '../../components/Table/Table';

const defaultCity = {
    name: '',
    price: 0
};

export const Cities = () => {
    const [cities, setCities] = useState([]);

    const [currentCity, setCurrentCity] = useState(defaultCity);
    const [isModalOpened, setIsModalOpened] = useState(false);

    const [errorModal, setErrorModal] = useState(false);

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();

        setCities(cities);
    });

    useEffect(() => {
        document.title = "Города - Clockwise Clockware";
        fetchCities();
    }, []);

    useEffect(() => {
        if (!isModalOpened)
            setCurrentCity(null);
    }, [isModalOpened]);

    const deleteCity = async (id) => {
        try {
            await CityService.deleteCityById(id);
            fetchCities();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const addCity = async (city) => {
        try {
            await CityService.addCity(city);
            setIsModalOpened(false);
            fetchCities();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }
    const updateCity = async (city) => {
        try {
            await CityService.updateCityById(city);
            setIsModalOpened(false);
            fetchCities();
        } catch (error) {
            console.log(error.response.data);
            setErrorModal(true);
        }
    }

    const tableHeaders = ["id", "Имя", "Цена", "Изменение", "Удаление"];

    const tableBodies = [
        `id`,
        `name`,
        `price`,
        {
            name: `Изменить`,
            callback: id => { setIsModalOpened(true); setCurrentCity(cities.find(city => city.id === id)) },
            param: `id`
        },
        {
            name: `Удалить`,
            callback: deleteCity,
            param: `id`
        }
    ];

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Города</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => { setIsModalOpened(true); setCurrentCity(defaultCity) }}>
                        Добавить
                    </AdminButton>
                </div>

                <MyModal visible={isModalOpened} setVisible={setIsModalOpened}>
                    {currentCity && <CityForm city={currentCity} onClick={currentCity.id ? updateCity : addCity} btnTitle={currentCity.id ? 'Изменить' : 'Добавить'}></CityForm>}
                </MyModal>

                <Table
                    data={cities}
                    tableHeaders={tableHeaders}
                    tableBodies={tableBodies}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>Произошла ошибка.</p></MyModal>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {cities.length === 0 && !isCitiesLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isCitiesLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}
