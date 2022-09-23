import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../AdminButton/AdminButton';
import { MASTER_STATUSES, MASTER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';

const MasterFilterSchema = z.object({
    cities: z.array(z.number().int().positive()).optional(),
    statuses: z.array(z.nativeEnum(MASTER_STATUSES)).optional()
});

export const MasterFilterForm = ({ filters, onClick, cities, setFilters }) => {
    const { control, handleSubmit, watch, getValues, reset, formState: { isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filters,
        resolver: zodResolver(MasterFilterSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
            <div className={classes.filterFormRow}>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="cities">Города</label>
                    </div>
                    <Controller
                        control={control}
                        name="cities"
                        render={({
                            field: { onChange }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filters.cities}
                                value={cities.filter(city => watch('cities').includes(city.id)).map(city => ({ value: city.id, label: city.name }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
                                options={cities.map(city => ({ value: city.id, label: city.name }))}
                                placeholder='Выбор городов...'
                            />
                        )}
                    />
                </div>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="statuses">Статусы</label>
                    </div>
                    <Controller
                        control={control}
                        name="statuses"
                        render={({
                            field: { onChange }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filters.statuses}
                                value={Object.entries(MASTER_STATUSES_TRANSLATE).filter(status => watch('statuses').includes(status[0])).map(([value, label]) => ({ value, label }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
                                options={Object.entries(MASTER_STATUSES_TRANSLATE).map(([value, label]) => ({ value, label }))}
                                placeholder='Выбор статусов...'
                            />
                        )}
                    />
                </div>

                <div className={classes.filterButton}>
                    <AdminButton type="submit" disabled={!isValid}>Фильтровать</AdminButton>
                    <AdminButton type="button" onClick={() => { reset(); setFilters(filters); }}>Сбросить</AdminButton>
                </div>
            </div>
        </form>
    )
}
