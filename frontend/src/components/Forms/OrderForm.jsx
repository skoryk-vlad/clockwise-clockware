import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { NumPicker } from '../NumPicker/NumPicker';

const OrderSchema = z.object({
    watchSize: z.number({ invalid_type_error: 'Требуется выбрать размер часов' }).int().min(1).max(3),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/, 'Требуется выбрать дату'),
    time: z.number({ invalid_type_error: 'Требуется выбрать время' }).int().min(10).max(18),
    rating: z.number({ invalid_type_error: 'Рейтинг должен быть числом' }).int().min(0, 'Рейтинг должен находиться в диапазоне 0-5').max(5, 'Рейтинг должен находиться в диапазоне 0-5'),
    clientId: z.number({ invalid_type_error: 'Требуется выбрать клиента' }).int().positive(),
    masterId: z.number({ invalid_type_error: 'Требуется выбрать мастера' }).int().positive(),
    cityId: z.number({ invalid_type_error: 'Требуется выбрать город' }).int().positive(),
    statusId: z.number({ invalid_type_error: 'Требуется выбрать статус' }).int().min(1).max(4)
});

export const OrderForm = ({ values, onClick, btnTitle, cities, masters, clients, statuses }) => {
    const { control, handleSubmit, getValues, setValue, watch, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'all',
        defaultValues: values,
        resolver: zodResolver(OrderSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="clientId">Клиент</label>
                    {errors.clientId && touchedFields.clientId && (
                        <div className={classes.errorMessage}>{errors.clientId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="clientId"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onBlur={onBlur}
                            onChange={val => setValue('clientId', +val)}
                            value={value || ''}
                            error={error}
                            options={clients.map(client => ({ value: client.id, name: `${client.name} (${client.email})` }))}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="cityId">Город</label>
                    {errors.cityId && touchedFields.cityId && (
                        <div className={classes.errorMessage}>{errors.cityId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="cityId"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onBlur={onBlur}
                            onChange={val => setValue('cityId', +val)}
                            value={value || ''}
                            error={error}
                            options={cities.map(city => ({ value: city.id, name: city.name }))}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="masterId">Мастер</label>
                    {errors.masterId && touchedFields.masterId && (
                        <div className={classes.errorMessage}>{errors.masterId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="masterId"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onBlur={onBlur}
                            onChange={val => setValue('masterId', +val)}
                            value={value || ''}
                            error={error}
                            options={masters.filter(m => m.cities.includes(watch("cityId"))).map(city => ({ value: city.id, name: city.name }))}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="watchSize">Размер часов</label>
                    {errors.watchSize && touchedFields.watchSize && (
                        <div className={classes.errorMessage}>{errors.watchSize.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="watchSize"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <NumPicker
                            name={name}
                            onBlur={onBlur}
                            from='1' to='3'
                            onClick={e => setValue('watchSize', +e.target.dataset.num)}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="date">Дата</label>
                    {errors.date && touchedFields.date && (
                        <div className={classes.errorMessage}>{errors.date.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="date"
                    render={({
                        field: { onChange, onBlur, value, name },
                        fieldState: { error },
                    }) => (
                        <MyInput
                            type="date" name={name}
                            onBlur={onBlur}
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
                    {errors.time && touchedFields.time && (
                        <div className={classes.errorMessage}>{errors.time.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="time"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <NumPicker
                            name={name}
                            onBlur={onBlur}
                            from='10' to='18' count={watch("watchSize")}
                            onClick={e => setValue('time', +e.target.dataset.num)}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>
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
                            onChange={e => setValue('rating', +e.target.value)}
                            value={value}
                            error={error}
                            placeholder="Рейтинг..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="statusId">Статус</label>
                    {errors.statusId && touchedFields.statusId && (
                        <div className={classes.errorMessage}>{errors.statusId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="statusId"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MySelect
                            name={name}
                            onBlur={onBlur}
                            onChange={val => setValue('statusId', +val)}
                            value={value || ''}
                            error={error}
                            options={statuses.map(status => ({ value: status.id, name: status.name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
