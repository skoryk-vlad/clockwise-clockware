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
import { Formik } from 'formik';
import classes from './AdminForm.module.css';
import { Navigate } from 'react-router-dom';

export const Masters = () => {
    const [masters, setMasters] = useState([]);

    const [newMaster, setNewMaster] = useState({
        name: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updMaster, setUpdMaster] = useState({
        name: ''
    });

    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState(false);
    
    const [redirect, setRedirect] = useState(false);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasters();

        setMasters(masters);
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
        if(idUpd) {
            setUpdMaster(masters.find(m => m.id === +idUpd));
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
                name: ''
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
                name: ''
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
                            value={newMaster}
                            onClick={addMaster} btnTitle={'Добавить'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updMaster}
                            onClick={updateMaster} btnTitle={'Изменить'} />

                <AdminTable dataArr={masters}
                            columns={['id', 'Имя']}
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

const ModalForm = ({ modal, setModal, value, onClick, btnTitle }) => {
    const [initialValues, setInitialValues] = useState({
        name: ''
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
                            
                            <AdminButton type="submit" className={!(dirty && isValid) ? "disabledBtn" : ""}
                                disabled={!(dirty && isValid)}>{btnTitle}</AdminButton>
                        </form>
                    );
                }}
            </Formik>
        </MyModal>
    )
}
