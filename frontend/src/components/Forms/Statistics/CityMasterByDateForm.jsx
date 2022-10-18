import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from '../Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../../AdminButton/AdminButton';
import { MyInput } from '../../input/MyInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAfter } from 'date-fns';

const CityMasterByDateSchema = z.object({
    dateStart: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
    dateEnd: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/).optional().or(z.literal('')),
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
