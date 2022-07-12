import React, { useEffect, useState } from 'react';
import { AuthService, CityService, MasterService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { MySelect } from '../../components/select/MySelect';
import { Formik } from 'formik';
import classes from './AdminForm.module.css';
import { Navigate } from 'react-router-dom';

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [newMaster, setNewMaster] = useState({
        name: '',
        rating: '',
        cityId: 1
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updMaster, setUpdMaster] = useState({
        name: '',
        rating: '',
        cityId: 1
    });

    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    
    const [redirect, setRedirect] = useState(false);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters();
        const cities = await CityService.getCities();

        setMasters(masters);
        setCities(cities);
    });

    useEffect(() => {
        document.title = "Мастера - Clockwise Clockware";

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
        
        fetchMasters();
    }, []);

    useEffect(() => {
        if(idUpd){
            let master = masters.find(m => m.id === +idUpd);
            master = {...master, cityId: cities.find(c => c.name === master.city).id};
            delete master.city;
            setUpdMaster(master);
        }
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteMaster = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await MasterService.deleteMasterById(id, localStorage.getItem('token'));
            fetchMasters();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const addMaster = async (master) => {
        try {
            await MasterService.addMaster(master, localStorage.getItem('token'));
            setModalAdd(false);
            setNewMaster({
                name: '',
                rating: '',
                cityId: 1
            });
            fetchMasters();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const updateMaster = async (master) => {
        try {
            await MasterService.updateMasterById(master, localStorage.getItem('token'));
            setModalUpd(false);
            setUpdMaster({
                name: '',
                rating: '',
                cityId: 1
            });
            fetchMasters();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
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

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                            value={newMaster} cities={cities}
                            onClick={addMaster} btnTitle={'Добавить'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updMaster} cities={cities}
                            onClick={updateMaster} btnTitle={'Изменить'} />

                <AdminTable dataArr={masters}
                            columns={['id', 'Имя', 'Город']}
                            btnTitles={['Изменение', 'Удаление']}
                            btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteMaster(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{fontSize: '20px'}}>{error}.</p></MyModal>

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

const ModalForm = ({ modal, setModal, value, onClick, btnTitle, cities }) => {
    const [initialValues, setInitialValues] = useState({
        name: '',
        // rating: '',
        cityId: 1
    });

    useEffect(() => {
        setInitialValues(value)
    }, [value]);
    
    const validate = (values) => {
        let errors = {};

        if (!values.name) {
            errors.name = "Требуется имя";
        } else if (values.name.trim().length < 3) {
            errors.name = "Имя должно быть не короче 3-х букв";
        }

        if (!values.cityId) {
            errors.cityId = "Требуется город";
        }

        return errors;
    };

    const submitForm = async (values, {resetForm}) => {
        resetForm({});
        onClick(values);
    }
    
    return (
        <MyModal visible={modal} setVisible={setModal}>
            <Formik 
                enableReinitialize
                initialValues={initialValues}
                validate={validate}
                onSubmit={submitForm}
            >
                {(formik) => {
                    const {
                        values,
                        handleChange,
                        handleSubmit,
                        errors,
                        touched,
                        handleBlur,
                        isValid,
                        dirty,
                        setFieldValue
                    } = formik;
                    return (
                        <form onSubmit={handleSubmit} className={classes.form}>
                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="name">Название</label>
                                    {errors.name && touched.name && (
                                        <div className={classes.error}>{errors.name}</div>
                                    )}
                                </div>
                                <MyInput
                                    type="text" name="name" id="name"
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Имя мастера..."
                                />
                            </div>
                            
                            <div className={classes.formRow}>
                                <label htmlFor="cityId">Город</label>
                                <MySelect
                                    name="cityId" id="cityId" value={values.cityId}
                                    onChange={value => setFieldValue( "cityId", parseInt(value))}
                                    options={cities.map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>
                            
                            <AdminButton type="submit" className={!(dirty && isValid) ? "disabledBtn" : ""}
                                disabled={!(dirty && isValid)}>{btnTitle}</AdminButton>
                        </form>
                    );
                }}
            </Formik>
        </MyModal>
    )
}
