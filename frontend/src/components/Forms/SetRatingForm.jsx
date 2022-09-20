import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';

const SetRatingSchema = z.object({
    rating: z.number({ invalid_type_error: 'Рейтинг должен быть числом' }).int().min(1, 'Рейтинг должен находиться в диапазоне 1-5').max(5, 'Рейтинг должен находиться в диапазоне 1-5')
});

export const SetRatingForm = ({ onClick }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            rating: 0
        },
        resolver: zodResolver(SetRatingSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="time">Рейтинг</label>
                    {errors.rating && (
                        <div className={classes.errorMessage}>{errors.rating.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="rating"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <MyInput
                            name={name} type="number"
                            onChange={event => onChange(+event.target.value)}
                            value={value}
                            error={error}
                            placeholder="Рейтинг..."
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>Выставить</AdminButton>
        </form>
    )
}
