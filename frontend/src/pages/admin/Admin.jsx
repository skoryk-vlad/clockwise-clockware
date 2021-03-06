import { Formik } from 'formik';
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthService, CityService, ClientService, MasterService, OrderService, StatusService } from '../../API/Server';
import { AdminButton } from '../../components/AdminButton/AdminButton';
import { AdminTable } from '../../components/AdminTable/AdminTable';
import { MyInput } from '../../components/input/MyInput';
import { MyModal } from '../../components/modal/MyModal';
import { Navbar } from '../../components/Navbar/Navbar'
import { MySelect } from '../../components/select/MySelect';
import { useFetching } from '../../hooks/useFetching';
import '../../styles/App.css';
import classes from './AdminForm.module.css';

export const Admin = () => {
    const [orders, setOrders] = useState([]);
    const [cities, setCities] = useState([]);
    const [masters, setMasters] = useState([]);
    const [clients, setClients] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const [modal, setModal] = useState(false);
    const [idUpd, setIdUpd] = useState(null);

    const [ordersCount, setOrdersCount] = useState(0);

    const [redirect, setRedirect] = useState(false);
    
    const [initialValues, setInitialValues] = useState({
        rating: 0,
        statusId: 1
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
        const statuses = await StatusService.getStatuses();

        setOrdersCount(orders.length);

        setOrders(orders.filter(o => o.status === statuses.find(s => s.id === 1).name || o.status === statuses.find(s => s.id === 2).name).map(o => ({ ...o, date: toDate(o.date) })));
        setCities(cities);
        setMasters(masters);
        setClients(clients);
        setStatuses(statuses);
    });

    useEffect(() => {
        document.title = "??????????-???????????? - Clockwise Clockware";

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
            setInitialValues({
                rating: 0,
                statusId: statuses.find(s => s.name === order.status).id
            })
        }
    }, [idUpd]);

    if (redirect) {
        return <Navigate push to="/admin/login" />
    }

    const changeStatus = async (values) => {
        await OrderService.changeStatusById(idUpd, values.statusId, values.rating, localStorage.getItem('token'));
        setModal(false);
        fetchOrders();
    };


    const validate = (values) => {
        let errors = {};

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
        resetForm({});
        changeStatus(values);
    }

    return (
        <div className='admin-container'>
            <Navbar />
            <div className='admin-body'>
                <h1 className='admin-body__title'>??????????????</h1>
                <div className='admin-main'>
                    <div className='admin-main__top top'>
                        <div className='top__item'>
                            <div className='top__title'>??????????????</div>
                            <div className='top__body'>{cities.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>????????????????</div>
                            <div className='top__body'>{masters.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>????????????????</div>
                            <div className='top__body'>{clients.length}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>??????????????</div>
                            <div className='top__body'>{ordersCount}</div>
                        </div>
                        <div className='top__item'>
                            <div className='top__title'>????????????????</div>
                            <div className='top__body'>{orders.length}</div>
                        </div>
                    </div>
                    <h2 className='admin-main__title'>???????????????? ????????????</h2>
                    <AdminTable dataArr={orders}
                        columns={['id', '????????????', '????????????', '??????????', '???????????? ??????????', '????????', '??????????', '??????????????', '????????????']}
                        btnTitles={['??????????????????']}
                        btnFuncs={[e => { setModal(true); setIdUpd(e.target.closest('tr').id) }]}
                    />
                </div>
            </div>

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
                            
                                <label htmlFor="statusId">????????????</label>
                                <MySelect
                                    name="statusId" id="statusId" value={values.statusId}
                                    onChange={value => setFieldValue("statusId", parseInt(value))}
                                    onBlur={handleBlur}
                                    options={statuses.map(status => ({ value: status.id, name: status.name }))}
                                />

                            <AdminButton type="submit" className={!(dirty && isValid) ? "disabledBtn" : ""}
                                disabled={!(dirty && isValid)}>????????????????</AdminButton>
                        </form>
                    );
                }}
            </Formik>
            </MyModal>
        </div>
    )
}