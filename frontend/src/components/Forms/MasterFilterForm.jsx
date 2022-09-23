import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MASTER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';

export const MasterFilterForm = ({ filterState, onClick, cities, setFilterState }) => {
    const { control, handleSubmit, getValues, reset, formState: { isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filterState
    });
    const onSubmit = () => onClick({ ...getValues(), cities: getValues()?.cities.map(city => city.value), statuses: getValues()?.statuses.map(status => status.value) });

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
                            field: { onChange, value }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filterState.cities}
                                value={value}
                                isMulti
                                onChange={onChange}
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
                            field: { onChange, value }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filterState.statuses}
                                value={value}
                                isMulti
                                onChange={onChange}
                                options={Object.entries(MASTER_STATUSES_TRANSLATE).map(([value, label]) => ({ value, label }))}
                                placeholder='Выбор статусов...'
                            />
                        )}
                    />
                </div>

                <div className={classes.filterButton}>
                    <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                        disabled={(isSubmitted && !isValid)}>Фильтровать</AdminButton>
                    <AdminButton type="button" onClick={() => { reset(); setFilterState(filterState); }}>Сбросить</AdminButton>
                </div>
            </div>
        </form>
    )
}
