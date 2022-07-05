import React, { useEffect, useState } from 'react';
import { CityService, MasterService } from '../../API/Server';
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

export const Masters = () => {
    const [masters, setMasters] = useState([]);
    const [cities, setCities] = useState([]);

    const [newMaster, setNewMaster] = useState({
        name: '',
        rating: '',
        city: 1
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
        const masters = await MasterService.getMasters();
        const cities = await CityService.getCities();

        setMasters(masters);
        setCities(cities);
    });

    useEffect(() => {
        fetchMasters();
        document.title = "Мастера - Clockwise Clockware";
    }, []);

    useEffect(() => {
        if(idUpd){
            const master = masters.find(m => m.id === +idUpd);
            setUpdMaster({...master, city: cities.find(c => c.name === master.city).id});
        }
    }, [idUpd]);

    const deleteMaster = async (event) => {
        const id = event.target.closest('tr').id;
        await MasterService.deleteMasterById(id, localStorage.getItem('token'));
        fetchMasters();
    }
    const addMaster = async (master) => {
        await MasterService.addMaster(master, localStorage.getItem('token'));
        setModalAdd(false);
        setNewMaster({
            name: '',
            rating: '',
            city: 3
        });
        fetchMasters();
    }
    const updateMaster = async (master) => {
        await MasterService.updateMasterById(master, localStorage.getItem('token'));
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

                <AdminTable dataArr={masters} setArray={setMasters} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteMaster(e)} />

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
        rating: '',
        city: 1
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

        if (!values.rating && values.rating !== 0) {
            errors.rating = "Требуется рейтинг";
        } else if (values.rating < 1 || values.rating > 5) {
            errors.rating = "Рейтинг должен находиться в диапазоне 1-5";
        } else if (parseInt(values.rating) !== values.rating) {
            errors.rating = "Рейтинг должен быть целым числом";
        }
        if (!values.city) {
            errors.city = "Требуется город";
        }

        return errors;
    };

    const submitForm = async (values) => {
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
                                    placeholder="Имя мастера..."
                                />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="rating">Рейтинг</label>
                                    {errors.rating && touched.rating && (
                                        <div className={classes.error}>{errors.rating}</div>
                                    )}
                                </div>
                                <MyInput
                                    type="number" name="rating" id="rating"
                                    value={values.rating}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Рейтинг мастера..."
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="city">Город</label>
                                <MySelect
                                    name="city" id="city" value={values.city || 1}
                                    onChange={value => handleChange("city")(value)}
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
