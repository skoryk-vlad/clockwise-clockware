import React, { useEffect, useState } from 'react';
import Server from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { OrderButton } from '../../components/OrderButton/OrderButton';
import { Helmet } from 'react-helmet';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { MySelect } from '../../components/select/MySelect';

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [newMaster, setNewMaster] = useState({
        name: '',
        rating: '',
        city_id: 1
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updMaster, setUpdMaster] = useState({
        name: '',
        rating: '',
        city: 1
    });

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await Server.getMasters();
        const cities = await Server.getCities();

        setMasters(masters);
        setCities(cities);
    });

    useEffect(() => {
        fetchMasters();
    }, []);

    useEffect(() => {
        if(idUpd)
            setUpdMaster(masters.find(m => m.id === +idUpd));
    }, [idUpd]);

    const deleteMaster = async (event) => {
        const id = event.target.closest('tr').id;
        await Server.deleteMasterById(id);
        fetchMasters();
    }
    const addMaster = async () => {
        await Server.addMaster(newMaster);
        setModalAdd(false);
        setNewMaster({
            name: '',
            rating: '',
            city: 1
        });
        fetchMasters();
    }
    const updateMaster = async () => {
        await Server.updateMasterById(idUpd, updMaster);
        setModalUpd(false);
        setUpdMaster({
            name: '',
            rating: '',
            city: 1
        });
        fetchMasters();
    }

    return (
        <div className='admin-container'>
            {/* <Helmet>
                <title>Мастера - Clockwise Clockware</title>
            </Helmet> */}
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>
                <MyModal visible={modalAdd} setVisible={setModalAdd}>
                    <MyInput value={newMaster.name} onChange={e => setNewMaster({...newMaster, name: e.target.value})} placeholder="Имя мастера..." />
                    <MyInput value={newMaster.rating} onChange={e => setNewMaster({...newMaster, rating: e.target.value})} placeholder="Рейтинг мастера..." />
                    <MySelect
                        value={newMaster.city} onChange={e => setNewMaster({...newMaster, city: e})}
                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                    />
                    <AdminButton onClick={() => addMaster()}>Добавить</AdminButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={updMaster.name} onChange={e => setUpdMaster({...updMaster, name: e.target.value})} placeholder="Имя мастера..." />
                    <MyInput value={updMaster.rating} onChange={e => setUpdMaster({...updMaster, rating: e.target.value})} placeholder="Рейтинг мастера..." />
                    <MySelect
                        value={cities.find(c => c.name === updMaster.city)?.id} onChange={e => setUpdMaster({...updMaster, city: e})}
                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                    />
                    <AdminButton onClick={() => updateMaster()}>Изменить</AdminButton>
                </MyModal>

                <AdminTable dataArr={masters} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteMaster(e)} />

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
