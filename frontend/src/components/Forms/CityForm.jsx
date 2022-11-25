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
    }).max(255),
    price: z.number({ invalid_type_error: 'Цена должна быть числом' }).int().positive('Цена должна быть положительным числом'),
});

export const CityForm = ({ city, onClick, btnTitle, openMap, mapBtnTitle }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: city,
        resolver: zodResolver(CitySchema)
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
                            placeholder="Название города..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="price">Цена</label>
                    {errors.price && (
                        <div className={classes.errorMessage}>{errors.price.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="price"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <MyInput
                            name={name} type="number"
                            onChange={event => onChange(+event.target.value)}
                            value={value}
                            error={error}
                            placeholder="Цена..."
                        />
                    )}
                />
            </div>
            {btnTitle !== 'Добавить' && <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="price">Область для услуги "Вызов мастера на дом"</label>
                    {errors.price && (
                        <div className={classes.errorMessage}>{errors.price.message}</div>
                    )}
                </div>
                <AdminButton type="button" onClick={openMap} className={classes.select}>{mapBtnTitle}</AdminButton>
            </div>}

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
