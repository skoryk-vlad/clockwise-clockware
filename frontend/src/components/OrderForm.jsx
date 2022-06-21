import React, { useEffect, useState } from 'react'
import Server from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import { MyInput } from './input/MyInput';
import { RadioBlock } from './radioBlock/RadioBlock';
import { MySelect } from './select/MySelect';
import { TimePicker } from './TimePicker/TimePicker';
import { Formik } from 'formik';
import classes from './OrderForm.module.css';

export const OrderForm = ({ setModal }) => {
    const [isForm, setIsForm] = useState(true);
    const [masters, setMasters] = useState([]);
    const [order, setOrder] = useState({});


    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await Server.getCities();

        setCities(cities);
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const initialValues = {
        name: "",
        email: "",
        watchSize: 1,
        city: 1,
        date: "",
        time: ""
    };

    const validate = (values) => {
        let errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

        if (!values.name) {
            errors.name = "Требуется имя";
        } else if (values.name.length < 3) {
            errors.name = "Имя должно быть не короче 3-х букв";
        }

        if (!values.email) {
            errors.email = "Требуется почта";
        } else if (!regex.test(values.email)) {
            errors.email = "Неправильный формат";
        }

        if (!values.city) {
            errors.city = "Требуется выбрать город";
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

    const chooseMaster = (e) => {
        e.target.closest(`.mstr_itm`).classList.add(classes.active);
        
        const master_id = e.target.closest(`.mstr_itm`).id;
        setOrder({...order, master_id: master_id});
    };

    const addOrder = async () => {
        Server.addOrderAndClient(order);
        setIsForm(true);
        setMasters([]);
        setModal(false);
    }

    const findMasters = async (values, {resetForm}) => {
        resetForm({});
        setOrder(values);
        const masters = await Server.getMastersByCity(values.city);
        console.log(masters);
        setMasters(masters);
        setIsForm(false);
    }

    return (
        <div>
            {isForm 
                ?
                <Formik initialValues={initialValues}
                    validate={validate}
                    onSubmit={findMasters}>
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
                                        <label htmlFor="name">Имя</label>
                                        {errors.name && touched.name && (
                                            <div className={classes.error}>{errors.name}</div>
                                        )}
                                    </div>
                                    <MyInput
                                        type="text" name="name" id="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Имя"
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
                                        placeholder="Почта"
                                    />
                                </div>

                                <div className={classes.formRow}>
                                    <label htmlFor="watchSize">Размер часов</label>
                                    <RadioBlock name="watchSize" id="watchSize" value={values.watchSize || 1} onClick={e => handleChange("watchSize")(e.target.id)} />
                                </div>

                                <div className={classes.formRow}>
                                    <label htmlFor="city">Город</label>
                                    <MySelect
                                        name="city" id="city" value={values.city || 1}
                                        onChange={value => handleChange("city")(value)}
                                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                                    />
                                </div>

                                <div className={classes.formRow}>
                                    <div className={classes.rowTop}>
                                        <label htmlFor="date">Дата</label>
                                        {errors.date && touched.date && (
                                            <div className={classes.error}>{errors.date}</div>
                                        )}
                                    </div>
                                    <MyInput name="date" id="date" type="date" value={values.date} onChange={handleChange} />
                                </div>

                                <div className={classes.formRow}>
                                    <div className={classes.rowTop}>
                                        <label htmlFor="time">Время</label>
                                        {errors.time && touched.time && (
                                            <div className={classes.error}>{errors.time}</div>
                                        )}
                                    </div>
                                    <TimePicker name="time" id="time"
                                                from='10' to='18' count={values.watchSize}
                                                value={values.time} onClick={e => handleChange("time")(e.target.textContent)} />
                                </div>

                                <OrderButton type="submit" className={!(dirty && isValid) ? "disabledBtn" : ""}
                                    disabled={!(dirty && isValid)}>Оформить заказ</OrderButton>
                            </form>
                        );
                    }}
                </Formik>
                :
                <div className={classes.mastersBlock}>
                    <div className={classes.mastersList}>
                        {
                            masters.map(master => 
                            <div key={master.id} id={master.id} className={classes.masterItem + ' mstr_itm'}>
                                <div className={classes.masterName}>{master.name}</div>
                                <div className={classes.masterRating}>Рейтинг: {master.rating}</div>
                                <OrderButton onClick={e => chooseMaster(e)} className={classes.masterBtn}>Выбрать</OrderButton>
                            </div>
                            )
                        }
                    </div>
                    <OrderButton onClick={() => {addOrder()}} className={classes.masterBtn}>Оформить заказ</OrderButton>
                </div>
            }
        </div>
    )
}
