import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { CLIENT_STATUSES } from '../../constants.ts';
import { MySelect } from '../select/MySelect';

const ClientSchema = z.object({
    name: z.string().trim().min(1, { message: 'Требуется имя' })
        .min(3, { message: 'Имя должно быть не короче 3-х букв' }).max(255),
    email: z.string().trim().min(1, { message: 'Требуется почта' }).email({ message: 'Неверный формат почты' }).max(255),
    status: z.nativeEnum(Object.keys(CLIENT_STATUSES))
});

export const ClientForm = ({ client, onClick, btnTitle }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: client,
        resolver: zodResolver(ClientSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="name">Имя</label>
                    {errors.name && (
                        <div className={classes.errorMessage}>{errors.name.message}</div>
                    )}
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
                            placeholder="Имя клиента..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="email">Почта</label>
                    {errors.email && (
                        <div className={classes.errorMessage}>{errors.email.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="email"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error },
                    }) => (
                        <MyInput
                            type="text" name={name}
                            onChange={onChange}
                            value={value}
                            error={error}
                            placeholder="Почта клиента..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="status">Статус</label>
                    {errors.status && (
                        <div className={classes.errorMessage}>{errors.status.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="status"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onChange={onChange}
                            value={value || ''}
                            error={error}
                            options={Object.keys(CLIENT_STATUSES).map(statusKey => ({ value: statusKey, name: CLIENT_STATUSES[statusKey] }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
