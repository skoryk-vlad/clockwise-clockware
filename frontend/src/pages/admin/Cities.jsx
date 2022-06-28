import React, { useEffect, useState } from 'react';
import Server from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { Helmet } from 'react-helmet';
import { AdminTable } from '../../components/AdminTable/AdminTable';

export const Cities = () => {
    const [cities, setCities] = useState([]);

    const [newCity, setNewCity] = useState('');
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updCity, setUpdCity] = useState('');

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await Server.getCities();

        setCities(cities);
    });

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if(idUpd)
            setUpdCity(cities.find(c => c.id === +idUpd).name);
    }, [idUpd]);

    const deleteCity = async (event) => {
        const id = event.target.closest('tr').id;
        console.log(id);
        await Server.deleteCityById(id);
        fetchCities();
    }
    const addCity = async () => {
        await Server.addCity(newCity);
        setModalAdd(false);
        setNewCity('');
        fetchCities();
    }
    const updateCity = async () => {
        await Server.updateCityById(idUpd, updCity);
        setModalUpd(false);
        setNewCity('');
        fetchCities();
    }

    return (
        <div className='admin-container'>
            {/* <Helmet>
                <title>Города - Clockwise Clockware</title>
            </Helmet> */}
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Города</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>
                <MyModal visible={modalAdd} setVisible={setModalAdd}>
                    <MyInput value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="Название города..." />
                    <AdminButton onClick={() => addCity()}>Добавить</AdminButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={updCity} onChange={e => setUpdCity(e.target.value)} placeholder="Название города..." />
                    <AdminButton onClick={() => updateCity()}>Изменить</AdminButton>
                </MyModal>

                <AdminTable dataArr={cities} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteCity(e)} />
                
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
