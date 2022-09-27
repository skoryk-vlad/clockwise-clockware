import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../AdminButton/AdminButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { MyInput } from '../input/MyInput';

const CityFilterSchema = z.object({
    name: z.string().optional()
});

export const CityFilterForm = ({ filters, onClick, setFilters }) => {
    const { control, handleSubmit, getValues, reset, formState: { isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filters,
        resolver: zodResolver(CityFilterSchema)
    });
    const onSubmit = () => onClick(getValues());
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
            <div className={classes.filterFormRow}>
                <div className={`${classes.rowColumn} ${classes.formInputWrapper}`}>
                    <div className={classes.rowTop}>
                        <label htmlFor="cities">Города</label>
                    </div>
                    <Controller
                        control={control}
                        name="name"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error }
                        }) => (
                            <MyInput
                                type="text" name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                                placeholder="Название города..."
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
