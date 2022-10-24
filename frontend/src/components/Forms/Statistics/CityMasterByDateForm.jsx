import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from '../Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../../AdminButton/AdminButton';
import { MyInput } from '../../input/MyInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAfter } from 'date-fns';

const CityMasterByDateSchema = z.object({
    dateStart: z.literal('').or(z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date())).optional(),
    dateEnd: z.literal('').or(z.preprocess(value => (typeof value === "string" || value instanceof Date) && new Date(value),
        z.date())).optional()
}).refine(value => !value.dateStart || !value.dateEnd || !isAfter(new Date(value.dateStart), new Date(value.dateEnd)));

export const CityMasterByDateForm = ({ filters, onClick }) => {
    const { control, reset, handleSubmit, getValues, formState: { isValid } } = useForm({
        mode: 'all',
        defaultValues: filters,
        resolver: zodResolver(CityMasterByDateSchema)
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
                <div className={classes.statisticsButtons}>
                    <AdminButton type="submit" className={!isValid ? "disabledBtn" : ""} disabled={!isValid}>Фильтровать</AdminButton>
                    <AdminButton type="button" onClick={() => { reset(); onClick(getValues()); }}>Сбросить</AdminButton>
                </div>
            </div>
        </form>
    )
}
