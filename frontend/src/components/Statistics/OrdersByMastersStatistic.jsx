import React, { useEffect } from 'react';
import classes from './Statistics.module.css';
import { useFetching } from '../../hooks/useFetching';
import { useState } from 'react';
import { OrderService } from '../../API/Server';
import { PieChart } from '../Charts/PieChart';
import { CityMasterByDateForm } from '../Forms/Statistics/CityMasterByDateForm';
import { Loader } from '../Loader/Loader';

const defaultFilters = {
    dateStart: '',
    dateEnd: ''
};

export const OrdersByMastersStatistic = () => {
    const [masters, setMasters] = useState([]);
    const [total, setTotal] = useState(null);
    const [filters, setFilters] = useState(defaultFilters);

    const [fetchMasters, isMastersLoading, Error] = useFetching(async () => {
        const masters = await OrderService.getOrderMasterStatistics({ ...filters });
        setMasters(masters.rows);
        setTotal(masters.count);
    });

    useEffect(() => {
        document.title = "Статистика заказов по мастерам - Clockwise Clockware";
    }, []);

    useEffect(() => {
        fetchMasters();
    }, [filters]);

    return (
        <div className={classes.statistics}>
            <div className={classes.statistics_item}>
                {masters.length > 0 &&
                    <PieChart label='Мастера' labels={masters.map(master => `${master.name} (${(master.count / total * 100).toFixed(1)}%)`)}
                        data={masters.map(master => +master.count)} />
                }
                {Error &&
                    <h2 className='adminError'>Произошла ошибка {Error}</h2>
                }
                {masters.length === 0 && !isMastersLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isMastersLoading &&
                    <Loader />
                }
            </div>
            <div className={classes.statistics_item}>
                <CityMasterByDateForm filters={filters}
                    onClick={newFilterState => { JSON.stringify(filters) !== JSON.stringify(newFilterState) && setFilters(newFilterState); }} />
            </div>
        </div>
    )
}
