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

export const Masters = () => {
    const [masters, setMasters] = useState([]);

    const [newMaster, setNewMaster] = useState({
        name: '',
        rating: '',
        city_id: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await Server.getMasters();

        setMasters(masters);
    });

    useEffect(() => {
        fetchMasters();
    }, []);

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
            city_id: ''
        });
        fetchMasters();
    }
    const updateMaster = async () => {
        await Server.updateMasterById(idUpd, newMaster);
        setModalUpd(false);
        setNewMaster({
            name: '',
            rating: '',
            city_id: ''
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
                    <MyInput value={newMaster.city_id} onChange={e => setNewMaster({...newMaster, city_id: e.target.value})} placeholder="id города мастера..." />
                    <OrderButton onClick={() => addMaster()}>Добавить</OrderButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={newMaster.name} onChange={e => setNewMaster({...newMaster, name: e.target.value})} placeholder="Имя мастера..." />
                    <MyInput value={newMaster.rating} onChange={e => setNewMaster({...newMaster, rating: e.target.value})} placeholder="Рейтинг мастера..." />
                    <MyInput value={newMaster.city_id} onChange={e => setNewMaster({...newMaster, city_id: e.target.value})} placeholder="id города мастера..." />
                    <OrderButton onClick={() => updateMaster()}>Изменить</OrderButton>
                </MyModal>

                <AdminTable dataArr={masters} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteMaster(e)} />

                {Error &&
                    <h2>Произошла ошибка ${Error}</h2>
                }
                {masters.length === 0 &&
                    <h2>Отсутствуют записи</h2>
                }
                {isMastersLoading &&
                    <Loader />
                }

            </div>
        </div>
    )
}
