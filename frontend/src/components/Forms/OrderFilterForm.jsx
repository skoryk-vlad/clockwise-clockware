import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { ORDER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';
import { MyInput } from '../input/MyInput';

export const OrderFilterForm = ({ filterState, onClick, cities, masters, setFilterState }) => {
    const { control, reset, handleSubmit, getValues, formState: { isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filterState
    });
    const onSubmit = () => onClick({
        ...getValues(),
        masters: getValues()?.masters.map(master => master.value),
        cities: getValues()?.cities.map(city => city.value),
        statuses: getValues()?.statuses.map(status => status.value)
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
            <div className={classes.filterFormRow}>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="masters">Мастера</label>
                    </div>
                    <Controller
                        control={control}
                        name="masters"
                        render={({
                            field: { onChange, value }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filterState.masters}
                                value={value}
                                isMulti
                                onChange={onChange}
                                options={masters.map(master => ({ value: master.id, label: master.name }))}
                                placeholder='Выбор мастеров...'
                            />
                        )}
                    />
                </div>
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
                                options={Object.entries(ORDER_STATUSES_TRANSLATE).map(([value, label]) => ({ value, label }))}
                                placeholder='Выбор статусов...'
                            />
                        )}
                    />
                </div>
            </div>
            <div className={classes.filterFormRow}>
                <div className={classes.formRange}>
                    <div className={classes.rowColumn}>
                        <div className={classes.rowTop}>
                            <label htmlFor="statuses">Дата (от): </label>
                        </div>
                        <Controller
                            control={control}
                            name="dateStart"
                            render={({
                                field: { onChange, value, name },
                                fieldState: { error },
                            }) => (
                                <MyInput
                                    type="date" name={name}
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                />
                            )}
                        />
                    </div>
                    <div className={classes.rowColumn}>
                        <div className={classes.rowTop}>
                            <label htmlFor="statuses">Дата (до): </label>
                        </div>
                        <Controller
                            control={control}
                            name="dateEnd"
                            render={({
                                field: { onChange, value, name },
                                fieldState: { error },
                            }) => (
                                <MyInput
                                    type="date" name={name}
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                />
                            )}
                        />
                    </div>
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
