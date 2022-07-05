import React, { useEffect, useState } from 'react';
import { CityService, MasterService, ClientService, OrderService } from '../../API/Server';
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
import { Toggler } from '../../components/Toggler/Toggler';

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);

    const [newOrder, setNewOrder] = useState({
        client: 1,
        master: 1,
        city: 1,
        watch_size: 1,
        date: '',
        time: '',
        completed: false
    });
    const [modalAdd, setModalAdd] = useState(false);

    const [modalUpd, setModalUpd] = useState(false);
    const [idUpd, setIdUpd] = useState(null);
    const [updOrder, setUpdOrder] = useState({
        client: 1,
        master: 1,
        city: 1,
        watch_size: 1,
        date: '',
        time: '',
        completed: false
    });

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

        setOrders(orders.map(o => ({ ...o, date: toDate(o.date) })));
        setCities(cities);
        setMasters(masters);
        setClients(clients);
    });

    useEffect(() => {
        fetchOrders();
        document.title = "Заказы - Clockwise Clockware";
    }, []);

    useEffect(() => {
        if (idUpd) {
            const order = orders.find(o => o.id === +idUpd);
            setUpdOrder({
                ...order,
                city: cities.find(c => c.name === order.city).id,
                master: masters.find(m => m.name === order.master).id,
                client: clients.find(c => c.name === order.client).id
            });
        }
    }, [idUpd]);

    const deleteOrder = async (event) => {
        const id = event.target.closest('tr').id;
        await OrderService.deleteOrderById(id, localStorage.getItem('token'));
        fetchOrders();
    }
    const addOrder = async (order) => {
        await OrderService.addOrder(order, localStorage.getItem('token'));
        setModalAdd(false);
        setNewOrder({
            client: 1,
            master: 1,
            city: 1,
            watch_size: 1,
            date: '',
            time: '',
            completed: false
        });
        fetchOrders();
    }
    const updateOrder = async (order) => {
        await OrderService.updateOrderById(order, localStorage.getItem('token'));
        setModalUpd(false);
        setUpdOrder({
            client: 1,
            master: 1,
            city: 1,
            watch_size: 1,
            date: '',
            time: '',
            completed: false
        });
        fetchOrders();
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
                            onClick={addOrder} btnTitle={'Добавить'} />

                <ModalForm modal={modalUpd} setModal={setModalUpd}
                            value={updOrder} cities={cities}
                            masters={masters} clients={clients}
                            onClick={updateOrder} btnTitle={'Изменить'} />

                <AdminTable dataArr={orders} setArray={setOrders} setModalUpd={setModalUpd} setIdUpd={setIdUpd} deleteRow={e => deleteOrder(e)} />

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

const ModalForm = ({ modal, setModal, value, onClick, btnTitle, cities, clients, masters }) => {
    const [initialValues, setInitialValues] = useState({
        client: 1,
        master: 1,
        city: 1,
        watch_size: 1,
        date: '',
        time: '',
        completed: false
    });

    useEffect(() => {
        setInitialValues(value);
    }, [value]);

    const validate = (values) => {
        let errors = {};

        if (!values.client) {
            errors.city = "Требуется клиент";
        }
        if (!values.master) {
            errors.city = "Требуется мастер";
        }
        if (!values.city) {
            errors.city = "Требуется город";
        }
        if (!values.watch_size) {
            errors.city = "Требуется размер часов";
        }
        if (!values.date) {
            errors.date = "Требуется выбрать дату";
        } else if((new Date(values.date)).getTime() < (new Date()).getTime()) {
            errors.date = "Выбрана неверная дата";
        }

        if (!values.time) {
            errors.time = "Требуется выбрать время";
        }

        return errors;
    };

    const submitForm = async (values) => {
        onClick(values);
    }

    const checkZero = (num) => {
        return num > 9 ? num : '0' + num;
    };
    const date = new Date();
    const minDate = `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;

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
                                <label htmlFor="client">Клиент</label>
                                <MySelect
                                    name="client" id="client" value={values.client}
                                    onChange={value => handleChange("client")(value)}
                                    options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="city">Город</label>
                                <MySelect
                                    name="city" id="city" value={values.city}
                                    onChange={value => handleChange("city")(value)}
                                    options={cities.map(city => ({ value: city.id, name: city.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="master">Мастер</label>
                                <MySelect
                                    name="master" id="master" value={values.master}
                                    onChange={value => handleChange("master")(value)}
                                    options={masters.filter(m => m.city === cities.find(c => c.id === +values.city).name).map(master => ({ value: master.id, name: master.name }))}
                                />
                            </div>

                            <div className={classes.formRow}>
                                <label htmlFor="watch_size">Размер часов</label>
                                <NumPicker name="watch_size" id="watch_size"
                                    from='1' to='3'
                                    value={values.watch_size} onClick={e => handleChange("watch_size")(e.target.dataset.num)} />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="date">Дата</label>
                                    {errors.date && (
                                        <div className={classes.error}>{errors.date}</div>
                                    )}
                                </div>
                                <MyInput name="date" id="date" min={minDate} type="date" value={values.date} onChange={handleChange} />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="time">Время</label>
                                    {errors.time && touched.time && (
                                        <div className={classes.error}>{errors.time}</div>
                                    )}
                                </div>
                                <NumPicker name="time" id="time" min={values.date === minDate ? date.getHours() + 1 : 0}
                                    from='10' to='18' count={values.watch_size}
                                    value={values.time} onClick={e => handleChange("time")(e.target.dataset.num)} />
                            </div>

                            <div className={classes.formRow}>
                                <div className={classes.rowTop}>
                                    <label htmlFor="completed">Выполнен</label>
                                    {errors.completed && touched.completed && (
                                        <div className={classes.error}>{errors.completed}</div>
                                    )}
                                </div>
                                <Toggler name="completed" id="completed"
                                    value={values.completed} titles={[true, false]} 
                                    onClick={e => handleChange("completed")(e.target.dataset.state)}/>
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
