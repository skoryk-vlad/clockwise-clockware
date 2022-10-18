import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from '../Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../../AdminButton/AdminButton';
import { MyInput } from '../../input/MyInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lookup, splitBySubstring } from '../../Lookup/Lookup';
import { CityService, MasterService } from '../../../API/Server';
import { isAfter } from 'date-fns';

const OrdersByDatesSchema = z.object({
    dateStart: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
    dateEnd: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
    masters: z.array(z.number().int().positive()).optional(),
    cities: z.array(z.number().int().positive()).optional(),
}).refine(value => !value.dateStart || !value.dateEnd || !isAfter(new Date(value.dateStart), new Date(value.dateEnd)));

export const OrdersByDatesForm = ({ filters, onClick }) => {
    const { control, reset, handleSubmit, getValues, formState: { isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filters,
        resolver: zodResolver(OrdersByDatesSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
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
            </div>
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
                            <Lookup getOptions={CityService.getCities}
                                value={value} onChange={onChange} defaultOptions
                                placeholder="Выбор городов..." isMulti
                                label={city => city.name}
                                formatOptionLabel={(label, inputValue) => {
                                    const parts = splitBySubstring(label, inputValue);
                                    return (<div>
                                        {parts[0]}<span className={classes.searched}>{parts[1]}</span>{parts[2]}
                                    </div>)
                                }}
                            />
                        )}
                    />
                </div>
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
                                value={value} onChange={onChange} defaultOptions
                                placeholder="Выбор мастеров..." isMulti
                                label={(master) => `${master.name} (${master.email})`}
                                formatOptionLabel={(label, inputValue) => {
                                    const labelArr = label.split(' ');
                                    const emailParts = splitBySubstring(labelArr.pop(), inputValue);
                                    const nameParts = splitBySubstring(labelArr.join(' '), inputValue);
                                    return (<div>
                                        {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                    </div>)
                                }}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={classes.filterFormRow}>
                <div className={classes.statisticsButtons}>
                    <AdminButton type="submit" className={!isValid ? "disabledBtn" : ""} disabled={!isValid}>Фильтровать</AdminButton>
                    <AdminButton type="button" onClick={() => { reset(); onClick(getValues()); }}>Сбросить</AdminButton>
                </div>
            </div>
        </form>
    )
}
