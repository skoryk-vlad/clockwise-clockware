import React, { useEffect } from 'react';
import classes from './Statistics.module.css';
import { useFetching } from '../../hooks/useFetching';
import { useState } from 'react';
import { MasterService } from '../../API/Server';
import { Loader } from '../Loader/Loader';
import { Table } from '../Table/Table';
import { ColumnHead } from '../Table/ColumnHead';

const defaultSortByField = {
    sortedField: 'id',
    isDirectedASC: true
};
const defaultPagination = {
    page: 1,
    limit: 10
};

const tableHeaders = [
    { value: 'id', title: 'id', sortable: true },
    { value: 'name', title: 'Имя', sortable: true },
    { value: 'small', title: 'Маленькие', sortable: true },
    { value: 'medium', title: 'Средние', sortable: true },
    { value: 'big', title: 'Большие', sortable: true },
    { value: 'rating', title: 'Рейтинг', sortable: true },
    { value: 'earned', title: 'Заработано', sortable: true },
    { value: 'completed', title: 'Выполнено', sortable: true },
    { value: 'notCompleted', title: 'Не выполнено', sortable: true }
];

export const MasterStatistic = () => {
    const [masters, setMasters] = useState([]);
    const [pagination, setPagination] = useState(defaultPagination);
    const [totalPages, setTotalPages] = useState(0);
    const [sortByField, setSortByField] = useState(defaultSortByField);

    const [fetchCities, isMastersLoading, Error] = useFetching(async () => {
        const masters = await MasterService.getMasterStatistics({ ...pagination, ...sortByField });
        setTotalPages(Math.ceil(masters.count / pagination.limit));
        setMasters(masters.rows);
    });

    useEffect(() => {
        document.title = "Статистика мастеров - Clockwise Clockware";
    }, []);

    useEffect(() => {
        fetchCities();
    }, [pagination, sortByField]);

    return (
        <div>
            <Table changeLimit={limit => setPagination({ ...pagination, limit: limit })} className={classes.statistics__table}
                changePage={changeTo => (changeTo > 0 && changeTo <= totalPages) && setPagination({ ...pagination, page: changeTo })}
                currentPage={pagination.page} totalPages={totalPages}>
                <thead>
                    <tr>
                        {tableHeaders.map(tableHeader => {
                            if (['small', 'medium', 'big', 'completed', 'notCompleted'].includes(tableHeader.value)) {
                                if (tableHeader.value === 'small') return <th key={tableHeader.value} colSpan={3}>Размер часов</th>
                                if (tableHeader.value === 'completed') return <th key={tableHeader.value} colSpan={2}>Заказы</th>
                            } else {
                                return <ColumnHead value={tableHeader.value} title={tableHeader.title} rowSpan={2}
                                    key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                    onClick={tableHeader.sortable &&
                                        (sortedField => sortByField.sortedField === sortedField
                                            ? setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC })
                                            : setSortByField({ sortedField: sortedField, isDirectedASC: true }))} />
                            }
                        })}
                    </tr>
                    <tr>
                        {tableHeaders.map(tableHeader => ['small', 'medium', 'big', 'completed', 'notCompleted'].includes(tableHeader.value) &&
                            <ColumnHead value={tableHeader.value} title={tableHeader.title}
                                key={tableHeader.value} sortable={tableHeader.sortable} sortByField={sortByField}
                                onClick={tableHeader.sortable &&
                                    (sortedField => sortByField.sortedField === sortedField
                                        ? setSortByField({ sortedField: sortedField, isDirectedASC: !sortByField.isDirectedASC })
                                        : setSortByField({ sortedField: sortedField, isDirectedASC: true }))} />
                        )}
                    </tr>
                </thead>
                <tbody>
                    {masters.map(master => <tr key={master.id}>
                        <td>{master.id}</td>
                        <td>{master.name}</td>
                        <td>{master.small}</td>
                        <td>{master.medium}</td>
                        <td>{master.big}</td>
                        <td>{master.rating || '-'}</td>
                        <td>{master.earned || '-'}</td>
                        <td>{master.completed}</td>
                        <td>{master.notCompleted}</td>
                    </tr>
                    )}
                </tbody>
            </Table>
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
    )
}
