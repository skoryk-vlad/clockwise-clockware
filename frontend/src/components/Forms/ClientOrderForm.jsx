import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { NumPicker } from '../NumPicker/NumPicker';
import { formatISO } from 'date-fns'
import { WATCH_SIZES } from '../../constants';

const date = new Date();
const minDate = formatISO(date, { representation: 'date' });
const minTime = date.getHours() + 2;

const ClientOrderSchema = z.object({
    name: z.string().trim().min(1, { message: 'Требуется имя' }).min(3, { message: 'Имя должно быть не короче 3-х букв' }).max(255),
    email: z.string().trim().min(1, { message: 'Требуется почта' }).email({ message: 'Неверный формат почты' }).max(255),
    watchSize: z.nativeEnum(Object.keys(WATCH_SIZES)),
    cityId: z.number({ invalid_type_error: 'Требуется выбрать город' }).int('asd').positive('fgh'),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/, 'Требуется выбрать дату'),
    time: z.number({ invalid_type_error: 'Требуется выбрать время' }).int().min(10).max(18)
}).superRefine((order, ctx) => {
    if (!(order.time + Object.keys(WATCH_SIZES).indexOf(order.watchSize) + 1 < 20)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['time'],
            message: "Выбрано неверное время или размер часов",
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['watchSize'],
            message: "Выбрано неверное время или размер часов",
        });
    }
    if (order.date === minDate && order.time < minTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['date'],
            message: "Выбрано неверное время или размер часов для текущей даты",
        });
    }
});

export const ClientOrderForm = ({ order, onClick, cities }) => {
    const { control, handleSubmit, getValues, watch, formState: { errors, isValid, isSubmitted } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: order,
        resolver: zodResolver(ClientOrderSchema)
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
                            placeholder="Имя"
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
                            placeholder="Почта"
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="watchSize">Размер часов</label>
                    {errors.watchSize && !isValid && (
                        <div className={classes.errorMessage}>{errors.watchSize.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="watchSize"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <NumPicker
                            name={name}
                            from='1' to='3'
                            onClick={(event) => onChange(Object.keys(WATCH_SIZES)[+event.target.dataset.num - 1])}
                            value={Object.keys(WATCH_SIZES).indexOf(value) + 1}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="cityId">Город</label>
                    {errors.cityId && (
                        <div className={classes.errorMessage}>{errors.cityId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    shouldUnregister={false}
                    name="cityId"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onChange={(value) => onChange(+value)}
                            value={value || ''}
                            error={error}
                            options={cities.map(city => ({ value: city.id, name: city.name }))}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="date">Дата</label>
                    {errors.date && !isValid && (
                        <div className={classes.errorMessage}>{errors.date.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="date"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error },
                    }) => (
                        <MyInput
                            type="date" name={name}
                            min={minDate}
                            onChange={onChange}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="time">Время</label>
                    {errors.time && !isValid && (
                        <div className={classes.errorMessage}>{errors.time.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="time"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error }
                    }) => (
                        <NumPicker
                            name={name}
                            from='10' to='18' count={Object.keys(WATCH_SIZES).indexOf(watch("watchSize")) + 1}
                            min={watch('date') ? (watch('date') === minDate ? minTime : 0) : 19}
                            onClick={(event) => onChange(+event.target.dataset.num)}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>Оформить заказ</AdminButton>
        </form>
    )
}
