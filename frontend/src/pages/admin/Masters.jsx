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
                    <BlueButton onClick={() => addMaster()}>Добавить</BlueButton>
                </MyModal>
                <MyModal visible={modalUpd} setVisible={setModalUpd}>
                    <MyInput value={newMaster.name} onChange={e => setNewMaster({...newMaster, name: e.target.value})} placeholder="Имя мастера..." />
                    <MyInput value={newMaster.rating} onChange={e => setNewMaster({...newMaster, rating: e.target.value})} placeholder="Рейтинг мастера..." />
                    <MyInput value={newMaster.city_id} onChange={e => setNewMaster({...newMaster, city_id: e.target.value})} placeholder="id города мастера..." />
                    <BlueButton onClick={() => updateMaster()}>Изменить</BlueButton>
                </MyModal>

                <table className='admin-body__table'>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>name</th>
                            <th>rating</th>
                            <th>city_id</th>
                            <th>Изменение</th>
                            <th>Удаление</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Error &&
                            <h1>Произошла ошибка ${Error}</h1>
                        }
                        {masters.map(master => 
                            <tr key={master.id} id={master.id}>
                                <td>{master.id}</td>
                                <td>{master.name}</td>
                                <td>{master.rating}</td>
                                <td>{master.city_id}</td>
                                <td className='admin-body__link'><span onClick={e => {setModalUpd(true); setIdUpd(e.target.closest('tr').id)}}>Изменить</span></td>
                                <td className='admin-body__link'><span onClick={e => deleteMaster(e)}>Удалить</span></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                        {isMastersLoading &&
                            <Loader />
                        }

            </div>
        </div>
    )
}
