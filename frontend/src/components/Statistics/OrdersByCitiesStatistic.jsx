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

export const OrdersByCitiesStatistic = () => {
    const [cities, setCities] = useState([]);
    const [total, setTotal] = useState(null);
    const [filters, setFilters] = useState(defaultFilters);

    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await OrderService.getOrderCityStatistics({ ...filters });
        setCities(cities.rows);
        setTotal(cities.count);
    });

    useEffect(() => {
        document.title = "Статистика заказов по городам - Clockwise Clockware";
    }, []);

    useEffect(() => {
        fetchCities();
    }, [filters]);

    return (
        <div className={classes.statistics}>
            <div className={classes.statistics_item}>
                {cities.length > 0 &&
                    <PieChart label='Города' labels={cities.map(city => `${city.name} (${(city.count / total * 100).toFixed(1)}%)`)}
                        data={cities.map(city => +city.count)} />
                }
                {Error &&
                    <h2 className='adminError'>Произошла ошибка {Error}</h2>
                }
                {cities.length === 0 && !isCitiesLoading && !Error &&
                    <h2 className='adminError'>Отсутствуют записи</h2>
                }
                {isCitiesLoading &&
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
