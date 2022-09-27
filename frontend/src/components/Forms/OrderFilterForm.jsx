import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../AdminButton/AdminButton';
import { ORDER_STATUSES, ORDER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';
import { MyInput } from '../input/MyInput';
import { zodResolver } from '@hookform/resolvers/zod';
import Slider from 'rc-slider';

const OrderFilterSchema = z.object({
    masters: z.array(z.number().int().positive()).optional(),
    cities: z.array(z.number().int().positive()).optional(),
    statuses: z.array(z.nativeEnum(ORDER_STATUSES)).optional(),
    dateStart: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
    dateEnd: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
});

export const OrderFilterForm = ({ filters, onClick, cities, masters, setFilters, maxPrice }) => {
    const { control, reset, handleSubmit, watch, getValues, formState: { isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filters,
        resolver: zodResolver(OrderFilterSchema)
    });
    const onSubmit = () => onClick(getValues());

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
                            field: { onChange }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filters.masters}
                                value={masters.filter(master => watch('masters').includes(master.id)).map(master => ({ value: master.id, label: master.name }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
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
                                value={Object.entries(ORDER_STATUSES_TRANSLATE).filter(status => watch('statuses').includes(status[0])).map(([value, label]) => ({ value, label }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
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
                <div className={classes.priceRangeWrapper}>
                    <Controller
                        control={control}
                        name="priceRange"
                        render={({
                            field: { onChange, value },
                            fieldState: { error },
                        }) => (
                            <>
                                <div className={classes.priceRangeTop}>
                                    <label htmlFor="statuses">Цена:</label>
                                    <MyInput
                                        className={classes.priceRangeInput}
                                        type="number" onChange={event => event.target.value >= 0 && event.target.value <= watch('priceRange')[1] && onChange([event.target.value, watch('priceRange')[1]])}
                                        value={watch('priceRange')[0]}
                                    />
                                    <MyInput
                                        className={classes.priceRangeInput}
                                        type="number" onChange={event => event.target.value <= maxPrice && event.target.value >= watch('priceRange')[0] && onChange([watch('priceRange')[0], event.target.value])}
                                        value={watch('priceRange')[1]}
                                    />
                                </div>
                                <Slider
                                    className={classes.priceRange}
                                    range
                                    allowCross={false}
                                    onChange={onChange} error={error}
                                    defaultValue={filters.priceRange}
                                    value={value}
                                    min={0} max={maxPrice}
                                />
                            </>
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
