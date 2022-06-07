import React, { useEffect, useState } from 'react'
import Server from '../API/Server';
import { useFetching } from '../hooks/useFetching';
import { BlueButton } from './BlueButton/BlueButton';
import { MyInput } from './input/MyInput';
import { RadioBlock } from './radioBlock/RadioBlock';
import { MySelect } from './select/MySelect';

export const OrderForm = () => {
    const [order, setOrder] = useState({
        name: '',
        email: '',
        watchSize: 1,
        city: '',
        date: '',
        time: ''
    });

    const addOrder = (e) => {
        e.preventDefault();
        setOrder({
            name: '',
            email: '',
            watchSize: 1,
            city: '',
            date: '',
            time: ''
        });
        Server.addOrderAndClient(order);
    }

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await Server.getCities();

        setCities(cities);
    });
    useEffect(() => {
        fetchCities();
    }, []);


    return (
        <form>
            <MyInput value={order.name} onChange={e => setOrder({ ...order, name: e.target.value })} type="text" placeholder="Имя" />
            <MyInput value={order.email} onChange={e => setOrder({ ...order, email: e.target.value })} type="email" placeholder="Почта" />

            <RadioBlock value={order.watchSize} onClick={e => setOrder({ ...order, watchSize: e.target.id })}/>
        
            <MySelect
                value={order.city}
                onChange={value => setOrder({ ...order, city: value })}
                defaultValue="Город"
                options={cities.map(city => ({value: city.id, name: city.name}))}
            />
            <MyInput value={order.date} onChange={e => setOrder({ ...order, date: e.target.value })} type="date" />
            <MyInput value={order.time} onChange={e => setOrder({ ...order, time: e.target.value })} type="time" />
            <BlueButton onClick={addOrder}>Создать пост</BlueButton>
        </form>
    )
}
