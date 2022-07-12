import React, { useEffect, useState } from 'react';
import { AuthService, CityService } from '../../API/Server';
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

export const Cities = () => {
    const [cities, setCities] = useState([]);

    const [newCity, setNewCity] = useState('');
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updCity, setUpdCity] = useState('');
    
    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    
    const [redirect, setRedirect] = useState(false);

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();

        setCities(cities);
    });

    useEffect(() => {
        document.title = "Города - Clockwise Clockware";

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
        
        fetchCities();
    }, []);

    useEffect(() => {
        if (idUpd)
            setUpdCity(cities.find(c => c.id === +idUpd).name);
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteCity = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await CityService.deleteCityById(id, localStorage.getItem('token'));
            fetchCities();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const addCity = async (name) => {
        try {
            await CityService.addCity(name, localStorage.getItem('token'));
            setModalAdd(false);
            setNewCity('');
            fetchCities();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const updateCity = async (name) => {
        try {
            await CityService.updateCityById(idUpd, name, localStorage.getItem('token'));
            setModalUpd(false);
            setNewCity('');
            fetchCities();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
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

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                            value={newCity}
                            onClick={addCity} btnTitle={'Добавить'} />
                
                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updCity}
                            onClick={updateCity} btnTitle={'Изменить'} />

                <AdminTable dataArr={cities}
                            columns={['id', 'Имя']}
                            btnTitles={['Изменение', 'Удаление']}
                            btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteCity(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{fontSize: '20px'}}>{error}.</p></MyModal>

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


const ModalForm = ({ modal, setModal, value, onClick, btnTitle }) => {
    const [initialValues, setInitialValues] = useState({
        name: ''
    });

    useEffect(() => {
        setInitialValues({
            name: value
        })
    }, [value]);
    
    const validate = (values) => {
        let errors = {};

        if (!values.name) {
            errors.name = "Требуется название";
        } else if (values.name.trim().length < 3) {
            errors.name = "Название должно быть не короче 3-х букв";
        }

        return errors;
    };

    const submitForm = async (values, {resetForm}) => {
        resetForm({});
        onClick(values.name);
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
                        dirty
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
                                    placeholder="Название города..."
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
