import React, { useEffect, useState } from 'react';
import Server from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { BlueButton } from '../../components/BlueButton/BlueButton';

export const Cities = () => {
    const [cities, setCities] = useState([]);

    const [newCity, setNewCity] = useState('');
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await Server.getCities();

        setCities(cities);
    });

    useEffect(() => {
        fetchCities();
    }, []);

    const deleteCity = async (event) => {
        const id = event.target.closest('tr').id;
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
        await Server.updateCityById(idUpd, newCity);
        setModalUpd(false);
        setNewCity('');
        fetchCities();
    }

    return (
        <div className='admin-container'>
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
                    <BlueButton onClick={() => addCity()}>Добавить</BlueButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="Название города..." />
                    <BlueButton onClick={() => updateCity()}>Изменить</BlueButton>
                </MyModal>

                <table className='admin-body__table'>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>Изменение</th>
                            <th>Удаление</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Error &&
                            <h1>Произошла ошибка ${Error}</h1>
                        }
                        {cities.map(city => 
                            <tr key={city.id} id={city.id}>
                                <td>{city.id}</td>
                                <td>{city.name}</td>
                                <td className='admin-body__link'><span onClick={e => {setModalUpd(true); setIdUpd(e.target.closest('tr').id)}}>Изменить</span></td>
                                <td className='admin-body__link'><span onClick={e => deleteCity(e)}>Удалить</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                        {isCitiesLoading &&
                            <Loader />
                        }

            </div>
        </div>
    )
}
