import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { STATUSES } from '../../constants.ts';

const ChangeStatusSchema = z.object({
    rating: z.number({ invalid_type_error: 'Рейтинг должен быть числом' }).int().min(0, 'Рейтинг должен находиться в диапазоне 0-5').max(5, 'Рейтинг должен находиться в диапазоне 0-5'),
    status: z.nativeEnum(Object.keys(STATUSES))
});

export const ChangeStatusForm = ({ order, onClick }) => {
    const { control, handleSubmit, getValues, setValue, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'onChange',
        defaultValues: order,
        resolver: zodResolver(ChangeStatusSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="time">Рейтинг</label>
                    {errors.rating && touchedFields.rating && (
                        <div className={classes.errorMessage}>{errors.rating.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="rating"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MyInput
                            name={name} type="number"
                            onBlur={onBlur}
                            onChange={event => setValue('rating', +event.target.value)}
                            value={value}
                            error={error}
                            placeholder="Рейтинг..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="status">Статус</label>
                    {errors.status && touchedFields.status && (
                        <div className={classes.errorMessage}>{errors.status.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="status"
                    render={({
                        field: { onChange, onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value || ''}
                            error={error}
                            options={Object.keys(STATUSES).map(statusKey => ({ value: statusKey, name: STATUSES[statusKey] }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>Изменить</AdminButton>
        </form>
    )
}
