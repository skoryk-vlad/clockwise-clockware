import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import { MyInput } from './input/MyInput';
import { MySelect } from './select/MySelect';
import { NumPicker } from './NumPicker/NumPicker';
import { Formik } from 'formik';
import classes from './OrderForm.module.css';

export const OrderForm = ({ setModal }) => {
    const [isForm, setIsForm] = useState(true);
    const [availMasters, setAvailMasters] = useState([]);
    const [order, setOrder] = useState({});
    const [returned, setReturned] = useState(false);
    const [chosenMaster, setChosenMaster] = useState(null);

    const checkZero = (num) => {
        return num > 9 ? num : '0' + num;
    };
    const date = new Date();
    const minDate = `${date.getFullYear()}-${checkZero(date.getMonth() + 1)}-${checkZero(date.getDate())}`;

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();

        setCities(cities.filter(c => masters.filter(m => m.city === c.name).length !== 0));
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const [initialValues, setInitialValues] = useState({
        name: "",
        email: "",
        watch_size: 1,
        city: 1,
        date: "",
        time: ""
    });

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
        const master_id = e.target.closest(`.mstr_itm`).id;
        setChosenMaster(master_id);
        setOrder({...order, master_id: master_id});
    };
    
    const addOrder = async () => {
        OrderService.addOrderAndClient(order);
        setIsForm(true);
        setModal(false);
        setReturned(false);
        setChosenMaster(null);
        setInitialValues({
            name: "",
            email: "",
            watch_size: 1,
            city: 1,
            date: "",
            time: ""
        });
    }

    const findMasters = async (values, {resetForm}) => {
        resetForm({});
        setOrder(values);
        const availableMasters = await MasterService.getAvailableMasters(values.city, values.date, values.time, values.watch_size);
        setAvailMasters(availableMasters);
        setIsForm(false);
    }

    const returnForm = () => {
        setInitialValues({...order, time: +order.time});
        setReturned(true);
        setIsForm(true);
    }

    return (
        <div>
            {isForm 
                ?
                <Formik initialValues={initialValues}
                    validate={validate}
                    onSubmit={findMasters}
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
                                    <label htmlFor="watch_size">Размер часов</label>
                                    <NumPicker name="watch_size" id="watch_size"
                                        from='1' to='3'
                                        value={values.watch_size} onClick={e => handleChange("watch_size")(e.target.dataset.num)} />
                                </div>

                                <div className={classes.formRow}>
                                    <label htmlFor="city">Город</label>
                                    <MySelect
                                        name="city" id="city" value={values.city}
                                        onChange={value => handleChange("city")(value)}
                                        options={cities.map(city => ({ value: city.id, name: city.name }))}
                                        // options={cities.filter(c => masters.filter(m => m.city === c.name).length !== 0).map(city => ({ value: city.id, name: city.name }))}
                                    />
                                </div>

                                <div className={classes.formRow}>
                                    <div className={classes.rowTop}>
                                        <label htmlFor="date">Дата</label>
                                        {errors.date && touched.date && (
                                            <div className={classes.error}>{errors.date}</div>
                                        )}
                                    </div>
                                    <MyInput name="date" id="date" type="date" min={minDate} value={values.date} onChange={handleChange} />
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

                                <OrderButton type="submit" className={!((dirty && isValid) || returned) ? "disabledBtn" : ""}
                                    disabled={!((dirty && isValid) || returned)}>Оформить заказ</OrderButton>
                            </form>
                        );
                    }}
                </Formik>
                :
                <div className={classes.mastersBlock}>
                    <div className={classes.mastersList}>
                        {
                            availMasters.map(master => 
                            <div key={master.id} id={master.id} className={classes.masterItem + ' mstr_itm' + (+chosenMaster === master.id ? ' ' + classes.active : '')}>
                                <div className={classes.masterName}>{master.name}</div>
                                <div className={classes.masterRating}>Рейтинг: {master.rating}</div>
                                <OrderButton onClick={e => chooseMaster(e)} className={classes.masterBtn}>Выбрать</OrderButton>
                            </div>
                            )
                        }
                        <div className={classes.return} onClick={returnForm}>
                            <img src="/images/icons/top.png" alt="Назад" />
                        </div>
                    </div>
                    <OrderButton onClick={() => {addOrder()}} className={(chosenMaster === null ? "disabledBtn" : '')}
                    disabled={chosenMaster === null}>Оформить заказ</OrderButton>
                </div>
            }
        </div>
    )
}
