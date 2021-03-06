import React, { useEffect, useState } from 'react';
import { CityService, MasterService, ClientService, OrderService, AuthService, StatusService, CityMasterService } from '../../API/Server';
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
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [connections, setConnections] = useState([]);

    const [newOrder, setNewOrder] = useState({
        clientId: 1,
        masterId: 1,
        cityId: 1,
        watch_size: 1,
        date: '',
        time: null,
        rating: 0,
        statusId: 1
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updOrder, setUpdOrder] = useState({
        clientId: 1,
        masterId: 1,
        cityId: 1,
        watch_size: 1,
        date: '',
        time: null,
        rating: 0,
        statusId: 1
    });

    const [error, setError] = useState('');
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
        const orders = await OrderService.getOrders(localStorage.getItem('token'));
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();
        const clients = await ClientService.getClients(localStorage.getItem('token'));
        const statuses = await StatusService.getStatuses();
        const connections = await CityMasterService.getConnectionsId();

        setOrders(orders.map(o => ({ ...o, date: toDate(o.date) })));
        setCities(cities);
        setMasters(masters);
        setClients(clients);
        setStatuses(statuses);
        setConnections(connections);
    });

    useEffect(() => {
        document.title = "???????????? - Clockwise Clockware";

        async function checkAuth() {
            if (localStorage.getItem('token')) {
                try {
                    await AuthService.checkAuth(localStorage.getItem('token'));
                } catch (e) {
                    setRedirect(true);
                }
            } else {
                setRedirect(true);
            }
        }
        checkAuth();

        fetchOrders();
    }, []);

    useEffect(() => {
        if (idUpd) {
            let order = orders.find(o => o.id === +idUpd);
            order = {
                ...order,
                cityId: cities.find(c => c.name === order.city).id,
                masterId: masters.find(m => m.name === order.master).id,
                clientId: clients.find(c => c.name === order.client).id,
                statusId: statuses.find(s => s.name === order.status).id
            };
            ['city', 'master', 'client', 'status'].forEach(function (k) {
                delete order[k];
            });
            setUpdOrder(order);
        }
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const deleteOrder = async (event) => {
        try {
            const id = event.target.closest('tr').id;
            await OrderService.deleteOrderById(id, localStorage.getItem('token'));
            fetchOrders();
        } catch (e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const addOrder = async (order) => {
        try {
            await OrderService.addOrder(order, localStorage.getItem('token'));
            setModalAdd(false);
            setNewOrder({
                clientId: 1,
                masterId: 1,
                cityId: 1,
                watch_size: 1,
                date: '',
                time: null,
                rating: 0,
                statusId: 1
            });
            fetchOrders();
            return true;
        } catch (e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }
    const updateOrder = async (order) => {
        try {
            await OrderService.updateOrderById(order, localStorage.getItem('token'));
            setModalUpd(false);
            setUpdOrder({
                clientId: 1,
                masterId: 1,
                cityId: 1,
                watch_size: 1,
                date: '',
                time: null,
                rating: 0,
                statusId: 1
            });
            fetchOrders();
        } catch (e) {
            setError(e.response.data);
            setErrorModal(true);
        }
    }

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>????????????</h1>

                <div className="admin-body__btns">
                    <AdminButton onClick={() => setModalAdd(true)}>
                        ????????????????
                    </AdminButton>
                </div>

                <ModalForm modal={modalAdd} setModal={setModalAdd}
                    value={newOrder} cities={cities}
                    masters={masters} clients={clients}
                    statuses={statuses} connections={connections}
                    onClick={addOrder} btnTitle={'????????????????'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                    value={updOrder} cities={cities}
                    masters={masters} clients={clients}
                    statuses={statuses} connections={connections}
                    onClick={updateOrder} btnTitle={'????????????????'} />

                <AdminTable dataArr={orders}
                    columns={['id', '????????????', '????????????', '??????????', '???????????? ??????????', '????????', '??????????', '??????????????', '????????????']}
                    btnTitles={['??????????????????', '????????????????']}
                    btnFuncs={[e => { setModalUpd(true); setIdUpd(e.target.closest('tr').id) }, e => deleteOrder(e)]}
                />

                <MyModal visible={errorModal} setVisible={setErrorModal}><p style={{ fontSize: '20px' }}>{error}.</p></MyModal>

                {Error &&
                    <h2 className='adminError'>?????????????????? ???????????? {Error}</h2>
                }
                {orders.length === 0 && !isOrdersLoading && !Error &&
                    <h2 className='adminError'>?????????????????????? ????????????</h2>
                }
                {isOrdersLoading &&
                    <Loader />
                }
            </div>
        </div>
    )
}

const ModalForm = ({ modal, setModal, value, onClick, btnTitle, cities, clients, masters, statuses, connections }) => {
    const [initialValues, setInitialValues] = useState({
        clientId: 1,
        masterId: 1,
        cityId: 1,
        watch_size: 1,
        date: '',
        time: null,
        rating: 0,
        statusId: 1
    });

    useEffect(() => {
        setInitialValues(value);
    }, [value]);

    const validate = (values) => {
        let errors = {};

        if (!values.clientId) {
            errors.clientId = "?????????????????? ????????????";
        }
        if (!values.masterId) {
            errors.masterId = "?????????????????? ????????????";
        }
        if (!values.cityId) {
            errors.city = "?????????????????? ??????????";
        }
        if (!values.watch_size) {
            errors.watch_size = "?????????????????? ???????????? ??????????";
        }
        if (!values.date) {
            errors.date = "?????????????????? ?????????????? ????????";
        }

        if (!values.time) {
            errors.time = "?????????????????? ?????????????? ??????????";
        }

        if (!values.rating && values.rating !== 0) {
            errors.rating = "?????????????????? ??????????????";
        } else if (values.rating < 0 || values.rating > 5) {
            errors.rating = "?????????????? ???????????? ???????????????????? ?? ?????????????????? 0-5";
        } else if (parseInt(values.rating) !== values.rating) {
            errors.rating = "?????????????? ???????????? ???????? ?????????? ????????????";
        }

        if (!values.statusId) {
            errors.statusId = "?????????????????? ?????????????? ????????????";
        }

        return errors;
    };

    const submitForm = async (values, { resetForm }) => {
        if(await onClick(values)){
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
                                <label htmlFor="clientId">????????????</label>
                                <MySelect
                                    name="clientId" id="clientId" value={values.clientId}
                                    onChange={value => setFieldValue("clientId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="cityId">??????????</label>
                                <MySelect
                                    name="cityId" id="cityId" value={values.cityId}
                                    onChange={value => setFieldValue("cityId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={cities.map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="masterId">????????????</label>
                                <MySelect
                                    name="masterId" id="masterId" value={values.masterId}
                                    onChange={value => setFieldValue("masterId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={masters.filter(m => connections.filter(c => c.city_id === values.cityId).map(c => c.master_id).includes(m.id)).map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>
                            
                            <div className={classes.formRow}>
                                <label htmlFor="watch_size">???????????? ??????????</label>
                                <NumPicker name="watch_size" id="watch_size"
                                    from='1' to='3' onBlur={handleBlur}
                                    value={values.watch_size}
                                    onClick={e => setFieldValue("watch_size", parseInt(e.target.dataset.num))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="date">????????</label>
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
                                    <label htmlFor="time">??????????</label>
                                    {errors.time && touched.time && (
                                        <div className={classes.error}>{errors.time}</div>
                                    )}
                                </div>
                                <NumPicker name="time" id="time" onBlur={handleBlur}
                                    from='10' to='18' count={values.watch_size}
                                    value={values.time}
                                    onClick={e => setFieldValue("time", parseInt(e.target.dataset.num))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="rating">??????????????</label>
                                    {errors.rating && touched.rating && (
                                        <div className={classes.error}>{errors.rating}</div>
                                    )}
                                </div>
                                <MyInput
                                    type="number" name="rating" id="rating"
                                    value={values.rating}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="??????????????..."
                                />
                            </div>
                            
                            <div className={classes.formRow}>
                                <label htmlFor="statusId">????????????</label>
                                <MySelect
                                    name="statusId" id="statusId" value={values.statusId}
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
