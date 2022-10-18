import React, { useEffect } from 'react';
import classes from './Statistics.module.css';
import { useFetching } from '../../hooks/useFetching';
import { useState } from 'react';
import { OrderService } from '../../API/Server';
import { Loader } from '../Loader/Loader';
import { LineChart } from '../Charts/LineChart';
import { OrdersByDatesForm } from '../Forms/Statistics/OrdersByDatesForm';
import { formatISO, addDays } from 'date-fns';

const defaultFilters = {
    dateStart: formatISO(addDays(new Date(), -30), { representation: 'date' }),
    dateEnd: formatISO(new Date(), { representation: 'date' }),
    masters: [],
    cities: []
};

export const OrdersByDatesStatistic = () => {
    const [orders, setCities] = useState([]);
    const [filters, setFilters] = useState(defaultFilters);

    const [fetchOrders, isOrdersLoading, Error] = useFetching(async () => {
        const orders = await OrderService.getOrderDateStatistics({ ...filters });
        setCities(orders);
    });

    useEffect(() => {
        document.title = "Статистика заказов по датам - Clockwise Clockware";
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [filters]);

    return (
        <div className={classes.statistics}>
            <div className={classes.statistics_item}>
                {orders.length > 0 &&
                    <LineChart label='Заказы' labels={orders.map(order => order.date)}
                        data={orders.map(order => order.count)} />
                }
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
            <div className={classes.statistics_item}>
                <OrdersByDatesForm filters={filters}
                    onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && setFilters(newFilterState); }} />
            </div>
        </div>
    )
}
