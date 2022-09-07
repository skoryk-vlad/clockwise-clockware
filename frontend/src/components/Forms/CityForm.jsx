import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';

const CitySchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Требуется название'
    }).min(3, {
        message: 'Название должно быть не короче 3-х букв'
    }).max(255)
});

export const CityForm = ({ values, onClick, btnTitle }) => {
    const { control, handleSubmit, getValues, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'onChange',
        defaultValues: values,
        resolver: zodResolver(CitySchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="name">Имя</label>
                    {errors.name && touchedFields.name && (
                        <div className={classes.errorMessage}>{errors.name.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="name"
                    render={({
                        field: { onChange, onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MyInput
                            type="text" name={name}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                            error={error}
                            placeholder="Название города..."
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
