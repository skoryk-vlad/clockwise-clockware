import React, { useEffect, useState } from 'react';
import { AuthService, CityMasterService, CityService, MasterService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { Formik } from 'formik';
import classes from './AdminForm.module.css';
import { Navigate } from 'react-router-dom';
import { MySelect } from '../../components/select/MySelect';

export const CityMaster = () => {
    const [connections, setConnections] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);

    const [newConnection, setNewConnection] = useState({
        cityId: 1,
        masterId: 1
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updConnection, setUpdConnection] = useState({
        cityId: 1,
        masterId: 1
    });
    
    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    
    const [redirect, setRedirect] = useState(false);

    const [fetchConnections, isConnectionsLoading, Error] = useFetching(async () => {
        const connections = await CityMasterService.getConnections();
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();

        setConnections(connections);
        setCities(cities);
        setMasters(masters);
    });

    useEffect(() => {
        document.title = "Города и мастера - Clockwise Clockware";

        async function checkAuth() {
            if(localStorage.getItem('token')) {
                try{
                    await AuthService.checkAuth(localStorage.getItem('token'));
                } catch(e) {
                    setRedirect(true);
                }
            } else {
                setRedirect(true);
            }
        }
        checkAuth();
        
        fetchConnections();
    }, []);

    useEffect(() => {
        if (idUpd) {
            let connection = connections.find(c => c.id === +idUpd);
            connection = {
                ...connection,
                cityId: cities.find(c => c.name === connection.city).id,
                masterId: masters.find(m => m.name === connection.master).id
            };
            ['city', 'master'].forEach(function (k) {
                delete connection[k];
            });
            setUpdConnection(connection);
        }
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteConnection = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await CityMasterService.deleteConnectionById(id, localStorage.getItem('token'));
            fetchConnections();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const addConnection = async (connection) => {
        try {
            await CityMasterService.addConnection(connection, localStorage.getItem('token'));
            setModalAdd(false);
            setNewConnection({
                cityId: 1,
                masterId: 1
            });
            fetchConnections();
        } catch(e) {
            setError('e.response.data');
            setErrorModal(true);
        }
    }
    const updateConnection = async (connection) => {
        try {
            await CityMasterService.updateConnectionById(connection, localStorage.getItem('token'));
            setModalUpd(false);
            setNewConnection({
                cityId: 1,
                masterId: 1
            });
            fetchConnections();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Города и мастера</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                            value={newConnection}
                            cities={cities} masters={masters}
                            onClick={addConnection} btnTitle={'Добавить'} />
                
                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updConnection}
                            cities={cities} masters={masters}
                            onClick={updateConnection} btnTitle={'Изменить'} />

                <AdminTable dataArr={connections}
                            columns={['id', 'Город', 'Мастер']}
                            btnTitles={['Изменение', 'Удаление']}
                            btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteConnection(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{fontSize: '20px'}}>{error}.</p></MyModal>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {connections.length === 0 && !isConnectionsLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isConnectionsLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}


const ModalForm = ({ modal, setModal, value, onClick, btnTitle, cities, masters }) => {
    const [initialValues, setInitialValues] = useState({
        cityId: 1,
        masterId: 1
    });

    useEffect(() => {
        setInitialValues(value)
    }, [value]);

    const submitForm = async (values, {resetForm}) => {
        resetForm({});
        onClick(values);
    }
    
    return (
        <MyModal visible={modal} setVisible={setModal}>
            <Formik 
                enableReinitialize
                initialValues={initialValues}
                onSubmit={submitForm}
            >
                {(formik) => {
                    const {
                        values,
                        handleSubmit,
                        setFieldValue
                    } = formik;
                    return (
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <div className={classes.formRow}>
                                <label htmlFor="cityId">Город</label>
                                <MySelect
                                    name="cityId" id="cityId" value={values.cityId}
                                    onChange={value => setFieldValue("cityId", parseInt(value))}
                                    options={cities.map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="masterId">Мастер</label>
                                <MySelect
                                    name="masterId" id="masterId" value={values.masterId}
                                    onChange={value => setFieldValue("masterId", parseInt(value))}
                                    options={masters.map(master => ({ value: master.id, name: master.name }))}
                                />
                            </div>
                            
                            <AdminButton type="submit" disabled={false}>{btnTitle}</AdminButton>
                        </form>
                    );
                }}
            </Formik>
        </MyModal>
    )
}
