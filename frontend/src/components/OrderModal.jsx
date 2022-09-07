import React, { useEffect, useState } from 'react'
import { CityService, MasterService, OrderService } from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { OrderButton } from './OrderButton/OrderButton';
import classes from './OrderModal.module.css';
import { ClientOrderForm } from './Forms/ClientOrderForm';

const defaultOrder = {
    name: "",
    email: "",
    watchSize: null,
    cityId: null,
    date: "",
    time: null
};

export const OrderModal = () => {
    const [isForm, setIsForm] = useState(true);
    const [sended, setSended] = useState(false);
    const [availMasters, setAvailMasters] = useState([]);
    const [order, setOrder] = useState(defaultOrder);
    const [chosenMaster, setChosenMaster] = useState(null);

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        const masters = await MasterService.getMasters();

        setCities(cities.filter(c => masters.find(m => m.cities.includes(c.id))));
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const chooseMaster = (e) => {
        const masterId = e.target.closest(`.mstr_itm`).id;
        setChosenMaster(+masterId);
        setOrder({...order, masterId: +masterId});
    };
    
    const addOrder = async () => {
        await OrderService.addOrder(order);
        setIsForm(true);
        setSended(true);
        setChosenMaster(null);
    }
    const findMasters = async (values) => {
        setOrder(values);
        setChosenMaster(null)
        const availableMasters = await MasterService.getAvailableMasters(values.cityId, values.date, values.time, values.watchSize);
        setAvailMasters(availableMasters.sort((a,b) => b.rating - a.rating).map(m => m.rating && +m.rating !== 0 ? m : {...m, rating: '-'}));
        setIsForm(false);
    }

    const returnForm = () => {
        setIsForm(true);
    }

    return (
        <div>
            {
            !sended ?
            isForm 
                ?
                <ClientOrderForm values={order} onClick={findMasters} cities={cities}></ClientOrderForm>
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
                        {
                            availMasters.length === 0 &&
                                <div className={classes.warning}>К сожалению, мастеров на это время в этот день нет. Выберите другое время или дату.</div>
                        }
                        <div className={classes.return} onClick={returnForm}>
                            <img src="/images/icons/top.png" alt="Назад" />
                        </div>
                    </div>
                    <OrderButton onClick={() => {addOrder()}} className={(chosenMaster === null ? "disabledBtn" : '')}
                    disabled={chosenMaster === null}>Оформить заказ</OrderButton>
                </div>
            :
            <div className='modalMessage'>Заказ успешно получен! <br/>
                        Для подтверждения заказа перейдите по ссылке, отправленной на вашу электронную почту!</div>
            }
        </div>
    )
}