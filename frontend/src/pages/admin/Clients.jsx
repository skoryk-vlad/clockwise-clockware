import React, { useEffect, useState } from 'react';
import { AuthService, ClientService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import classes from './AdminForm.module.css';
import { Formik } from 'formik';
import { Navigate } from 'react-router-dom';

export const Clients = () => {
    const [clients, setClients] = useState([]);

    const [newClient, setNewClient] = useState({
        name: '',
        email: ''
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updClient, setUpdClient] = useState({
        name: '',
        email: ''
    });

    const [error, setError] = useState('');
    const [errorModal, setErrorModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const [fetchClients, isClientsLoading, Error] = useFetching(async () => {
        const clients = await ClientService.getClients(localStorage.getItem('token'));

        setClients(clients);
    });

    useEffect(() => {
        document.title = "Клиенты - Clockwise Clockware";

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

        fetchClients();
    }, []);

    useEffect(() => {
        if(idUpd)
            setUpdClient(clients.find(c => c.id === +idUpd));
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteClient = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await ClientService.deleteClientById(id, localStorage.getItem('token'));
            fetchClients();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const addClient = async (client) => {
        try {
            await ClientService.addClient(client, localStorage.getItem('token'));
            setModalAdd(false);
            setNewClient({
                name: '',
                email: ''
            });
            fetchClients();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const updateClient = async (client) => {
        try {
            await ClientService.updateClientById(client, localStorage.getItem('token'));
            setModalUpd(false);
            setNewClient({
                name: '',
                email: ''
            });
            fetchClients();
        } catch(e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Клиенты</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                            value={newClient}
                            onClick={addClient} btnTitle={'Добавить'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updClient}
                            onClick={updateClient} btnTitle={'Изменить'} />

                <AdminTable dataArr={clients}
                            columns={['id', 'Имя', 'Почта']}
                            btnTitles={['Изменение', 'Удаление']}
                            btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteClient(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{fontSize: '20px'}}>{error}.</p></MyModal>

                {isClientsLoading &&
                    <Loader />
                }
                {Error &&
                    <h2 className='adminError'>Произошла ошибка ${Error}</h2>
                }
                {clients.length === 0 && !isClientsLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
            </div>
        </div>
    )
}

const ModalForm = ({ modal, setModal, value, onClick, btnTitle }) => {
    const [initialValues, setInitialValues] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        setInitialValues(value)
    }, [value]);
    
    const validate = (values) => {
        let errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.name) {
            errors.name = "Требуется имя";
        } else if (values.name.trim().length < 3) {
            errors.name = "Имя должно быть не короче 3-х букв";
        }

        if (!values.email) {
            errors.email = "Требуется почта";
        } else if (!regex.test(values.email)) {
            errors.email = "Неправильный формат";
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
                                    placeholder="Имя клиента..."
                                />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="email">Почта</label>
                                    {errors.email && touched.email && (
                                        <div className={classes.error}>{errors.email}</div>
                                    )}
                                </div>
                                <MyInput
                                    type="email" name="email" id="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Почта клиента..."
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
