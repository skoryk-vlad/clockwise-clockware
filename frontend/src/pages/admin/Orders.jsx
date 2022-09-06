import React, { useEffect, useState } from 'react';
import { CityService, MasterService, ClientService, OrderService, AuthService, StatusService } from '../../API/Server';
import { Navbar } from '../../components/Navbar/Navbar';
import { Loader } from '../../components/Loader/Loader';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import { MyModal } from '../../components/modal/MyModal';
import { MyInput } from '../../components/input/MyInput';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { MySelect } from '../../components/select/MySelect';
import { NumPicker } from '../../components/NumPicker/NumPicker';
import classes from './AdminForm.module.css';
import { Formik } from 'formik';
import { Navigate } from 'react-router-dom';

export const Orders = () => {
    const defaultOrder = {
        clientId: null,
        masterId: null,
        cityId: null,
        watchSize: null,
        date: '',
        time: null,
        rating: 0,
        statusId: null
    };
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [newOrder, setNewOrder] = useState(defaultOrder);
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updOrder, setUpdOrder] = useState(defaultOrder);

    const [error, setError] = useState('Произошла ошибка');
    const [errorModal, setErrorModal] = useState(false);

    const [redirect, setRedirect] = useState(false);

    const checkZero = (num) => {
        return num > 9 ? num : '0' + num;
    };

    const toDate = (strDate) => {
        const date = new Date(strDate);
        return `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;
    }

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        let orders = await OrderService.getOrders();

        orders = orders.map(o => {
            let order = {
                ...o,
                date: toDate(o.date),
                city: o.City.name,
                client: o.Client.name,
                master: o.Master.name,
                status: o.Status.name,
            };
            ['City', 'Master', 'Client', 'Status', 'cityId', 'masterId', 'clientId', 'statusId', 'createdAt', 'updatedAt'].forEach((k) => {
                delete order[k];
            });
            return order;
        });

        setOrders(orders);
    });

    useEffect(() => {
        document.title = "Заказы - Clockwise Clockware";

        const checkAuth = async () => {
            try {
                await AuthService.checkAuth();
                const cities = await CityService.getCities();
                const masters = await MasterService.getMasters();
                const clients = await ClientService.getClients();
                const statuses = await StatusService.getStatuses();

                setCities(cities);
                setMasters(masters);
                setClients(clients);
                setStatuses(statuses);

                fetchOrders();
            } catch (e) {
                setRedirect(true);
            }
        }
        checkAuth();
    }, []);

    useEffect(() => {
        if (orders.find(o => o.id === +idUpd)) {
            let order = orders.find(o => o.id === +idUpd);
            order = {
                ...order,
                cityId: cities.find(c => c.name === order.city).id,
                masterId: masters.find(m => m.name === order.master).id,
                clientId: clients.find(c => c.name === order.client).id,
                statusId: statuses.find(s => s.name === order.status).id
            };
            ['city', 'master', 'client', 'status'].forEach((k) => {
                delete order[k];
            });
            setUpdOrder(order);
        }
    }, [idUpd, orders]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteOrder = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await OrderService.deleteOrderById(id);
            fetchOrders();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const addOrder = async (order) => {
        try {
            const client = clients.find(c => c.id === order.clientId);
            await OrderService.addOrder({...order, name: client.name, email: client.email});
            setModalAdd(false);
            setNewOrder(defaultOrder);
            fetchOrders();
            return true;
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }
    const updateOrder = async (order) => {
        try {
            await OrderService.updateOrderById(order);
            setModalUpd(false);
            fetchOrders();
        } catch (e) {
            console.log(e.response.data);
            setErrorModal(true);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>Заказы</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        Добавить
                    </AdminButton>
                </div>

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                    value={newOrder} cities={cities}
                    masters={masters} clients={clients}
                    statuses={statuses}
                    onClick={addOrder} btnTitle={'Добавить'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                    value={updOrder} cities={cities}
                    masters={masters} clients={clients}
                    statuses={statuses}
                    onClick={updateOrder} btnTitle={'Изменить'} />

                <AdminTable dataArr={orders}
                    columns={['id', 'Размер часов', 'Дата', 'Время', 'Рейтинг', 'Город', 'Клиент', 'Мастер', 'Статус']}
                    btnTitles={['Изменение', 'Удаление']}
                    btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteOrder(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>{error}.</p></MyModal>

                {Error &&
                    <h2 className='adminError'>Произошла ошибка {Error}</h2>
                }
                {orders.length === 0 && !isOrdersLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isOrdersLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}

const ModalForm = ({ modal, setModal, value, onClick, btnTitle, cities, clients, masters, statuses }) => {
    const [initialValues, setInitialValues] = useState({
        clientId: null,
        masterId: null,
        cityId: null,
        watchSize: null,
        date: '',
        time: null,
        rating: 0,
        statusId: null
    });

    useEffect(() => {
        setInitialValues(value);
    }, [value]);

    const validate = (values) => {
        let errors = {};

        if (!values.clientId) {
            errors.clientId = "Требуется клиент";
        }
        if (!values.masterId) {
            errors.masterId = "Требуется мастер";
        }
        if (!values.cityId) {
            errors.city = "Требуется город";
        }
        if (!values.watchSize) {
            errors.watchSize = "Требуется размер часов";
        }
        if (!values.date) {
            errors.date = "Требуется выбрать дату";
        }

        if (!values.time) {
            errors.time = "Требуется выбрать время";
        }

        if (!values.rating && values.rating !== 0) {
            errors.rating = "Требуется рейтинг";
        } else if (values.rating < 0 || values.rating > 5) {
            errors.rating = "Рейтинг должен находиться в диапазоне 0-5";
        } else if (parseInt(values.rating) !== values.rating) {
            errors.rating = "Рейтинг должен быть целым числом";
        }

        if (!values.statusId) {
            errors.statusId = "Требуется выбрать статус";
        }

        return errors;
    };

    const submitForm = async (values, { resetForm }) => {
        if (await onClick(values)) {
            resetForm({});
        }
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
                                <label htmlFor="clientId">Клиент</label>
                                <MySelect
                                    name="clientId" id="clientId" value={values.clientId || ''}
                                    onChange={value => setFieldValue("clientId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="cityId">Город</label>
                                <MySelect
                                    name="cityId" id="cityId" value={values.cityId || ''}
                                    onChange={value => setFieldValue("cityId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={cities.map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="masterId">Мастер</label>
                                <MySelect
                                    name="masterId" id="masterId" value={values.masterId || ''}
                                    onChange={value => setFieldValue("masterId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={masters.filter(m => m.cities.includes(values.cityId)).map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="watchSize">Размер часов</label>
                                <NumPicker name="watchSize" id="watchSize"
                                    from='1' to='3' onBlur={handleBlur}
                                    value={values.watchSize}
                                    onClick={e => setFieldValue("watchSize", parseInt(e.target.dataset.num))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="date">Дата</label>
                                    {errors.date && touched.date && (
                                        <div className={classes.error}>{errors.date}</div>
                                    )}
                                </div>
                                <MyInput name="date" id="date"
                                    type="date" value={values.date}
                                    onChange={handleChange} onBlur={handleBlur} />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="time">Время</label>
                                    {errors.time && touched.time && (
                                        <div className={classes.error}>{errors.time}</div>
                                    )}
                                </div>
                                <NumPicker name="time" id="time" onBlur={handleBlur}
                                    from='10' to='18' count={values.watchSize}
                                    value={values.time}
                                    onClick={e => setFieldValue("time", parseInt(e.target.dataset.num))}
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
                                    placeholder="Рейтинг..."
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="statusId">Статус</label>
                                <MySelect
                                    name="statusId" id="statusId" value={values.statusId || ''}
                                    onChange={value => setFieldValue("statusId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={statuses.map(status => ({ value: status.id, name: status.name }))}
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
