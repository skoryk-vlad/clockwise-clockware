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
import { Lookup, splitBySubstring } from '../Lookup/Lookup';
import { ClientService, MasterService } from '../../API/Server';

const OrderFilterSchema = z.object({
    masters: z.array(z.number().int().positive()).optional(),
    clients: z.array(z.number().int().positive()).optional(),
    cities: z.array(z.number().int().positive()).optional(),
    statuses: z.array(z.nativeEnum(ORDER_STATUSES)).optional(),
    dateStart: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
    dateEnd: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
});

export const OrderFilterForm = ({ filters, onClick, cities, setFilters, prices }) => {
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
                            field: { onChange, value }
                        }) => (
                            <Lookup getOptions={MasterService.getMasters}
                                value={value} onChange={onChange}
                                placeholder="Выбор мастеров..." isMulti
                                label={(master) => `${master.name} (${master.email})`}
                                formatOptionLabel={(label, inputValue) => {
                                    const labelArr = label.split(' ');
                                    const nameParts = splitBySubstring(labelArr[0], inputValue);
                                    const emailParts = splitBySubstring(labelArr[1], inputValue);
                                    return (<div>
                                        {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                    </div>)
                                }}
                            />
                        )}
                    />
                </div>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="clients">Клиенты</label>
                    </div>
                    <Controller
                        control={control}
                        name="clients"
                        render={({
                            field: { onChange, value }
                        }) => (
                            <Lookup getOptions={ClientService.getClients}
                                value={value} onChange={onChange}
                                placeholder="Выбор клиентов..." isMulti
                                label={(client) => `${client.name} (${client.email})`}
                                formatOptionLabel={(label, inputValue) => {
                                    const labelArr = label.split(' ');
                                    const nameParts = splitBySubstring(labelArr[0], inputValue);
                                    const emailParts = splitBySubstring(labelArr[1], inputValue);
                                    return (<div>
                                        {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                    </div>)
                                }}
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
                                        type="number" value={watch('priceRange')[0]}
                                        onChange={event => onChange([event.target.value, watch('priceRange')[1]])}
                                        onBlur={event => {
                                            if (event.target.value > watch('priceRange')[1]) onChange([watch('priceRange')[1], watch('priceRange')[1]]);
                                            if (event.target.value < prices[0]) onChange([prices[0], watch('priceRange')[1]]);
                                        }}
                                        onKeyDown={event => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                if (event.target.value > watch('priceRange')[1]) onChange([watch('priceRange')[1], watch('priceRange')[1]]);
                                                if (event.target.value < prices[0]) onChange([prices[0], watch('priceRange')[1]]);
                                            }
                                        }}
                                    />
                                    <MyInput
                                        className={classes.priceRangeInput}
                                        type="number" value={watch('priceRange')[1]}
                                        onChange={event => onChange([watch('priceRange')[0], event.target.value])}
                                        onBlur={event => {
                                            if (event.target.value < watch('priceRange')[0]) onChange([watch('priceRange')[0], watch('priceRange')[0]]);
                                            if (event.target.value > prices[1]) onChange([watch('priceRange')[0], prices[1]]);
                                        }}
                                        onKeyDown={event => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                if (event.target.value < watch('priceRange')[0]) onChange([watch('priceRange')[0], watch('priceRange')[0]]);
                                                if (event.target.value > prices[1]) onChange([watch('priceRange')[0], prices[1]]);
                                            }
                                        }}
                                    />
                                </div>
                                <Slider
                                    className={classes.priceRange}
                                    range
                                    allowCross={false}
                                    onChange={onChange} error={error}
                                    defaultValue={filters.priceRange}
                                    value={value}
                                    min={prices[0]} max={prices[1]}
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
