import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';

const ClientSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Требуется имя'
    }).min(3, {
        message: 'Имя должно быть не короче 3-х букв'
    }).max(255),
    email: z.string().trim().min(1, {
        message: 'Требуется почта'
    }).email({
        message: 'Неверный формат почты'
    }).max(255)
});

export const ClientForm = ({ values, onClick, btnTitle }) => {
    const { control, handleSubmit, getValues, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'onChange',
        defaultValues: values,
        resolver: zodResolver(ClientSchema)
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
                            placeholder="Имя клиента..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="email">Почта</label>
                    {errors.email && touchedFields.email && (
                        <div className={classes.errorMessage}>{errors.email.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="email"
                    render={({
                        field: { onChange, onBlur, value, name },
                        fieldState: { error },
                    }) => (
                        <MyInput
                            type="email" name={name}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                            error={error}
                            placeholder="Почта клиента..."
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
