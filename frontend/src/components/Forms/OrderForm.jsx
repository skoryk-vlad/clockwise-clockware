import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { NumPicker } from '../NumPicker/NumPicker';
import { ORDER_STATUSES, ORDER_STATUSES_TRANSLATE, WATCH_SIZES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { Lookup, splitBySubstring } from '../Lookup/Lookup';
import { CityService, ClientService, MasterService } from '../../API/Server';

const OrderSchema = z.object({
    watchSize: z.nativeEnum(WATCH_SIZES),
    date: z.string().regex(/([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8])))/, 'Требуется выбрать дату'),
    time: z.number({ invalid_type_error: 'Требуется выбрать время' }).int().min(10).max(18),
    rating: z.number({ invalid_type_error: 'Рейтинг должен быть числом' }).int().min(0, 'Рейтинг должен находиться в диапазоне 0-5').max(5, 'Рейтинг должен находиться в диапазоне 0-5'),
    clientId: z.number({ invalid_type_error: 'Требуется выбрать клиента' }).int().positive(),
    masterId: z.number({ invalid_type_error: 'Требуется выбрать мастера' }).int().positive(),
    cityId: z.number({ invalid_type_error: 'Требуется выбрать город' }).int().positive(),
    status: z.nativeEnum(ORDER_STATUSES)
}).superRefine((order, ctx) => {
    if (!(order.time + Object.values(WATCH_SIZES).indexOf(order.watchSize) + 1 < 20)) {
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
});

export const OrderForm = ({ order, onClick, btnTitle }) => {
    const { control, handleSubmit, getValues, watch, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: order,
        resolver: zodResolver(OrderSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="clientId">Клиент</label>
                    {errors.clientId && (
                        <div className={classes.errorMessage}>{errors.clientId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="clientId"
                    render={({
                        field: { onChange, value }
                    }) => (
                        <Lookup getOptions={ClientService.getClients}
                            value={value} onChange={onChange}
                            defaultValue={order.Client && { value: order.Client.id, label: `${order.Client.name} (${order.Client.User.email})` }}
                            placeholder="Выбор клиента..." defaultOptions
                            label={(client) => `${client.name} (${client.email})`}
                            formatOptionLabel={(label, inputValue) => {
                                const labelArr = label.split(' ');
                                const emailParts = splitBySubstring(labelArr.pop(), inputValue);
                                const nameParts = splitBySubstring(labelArr.join(' '), inputValue);
                                return (<div>
                                    {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                </div>)
                            }}
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
                    name="cityId"
                    render={({
                        field: { onChange, value }
                    }) => (
                        <Lookup getOptions={CityService.getCities}
                            value={value} onChange={onChange}
                            defaultValue={order.City && { value: order.City.id, label: order.City.name }}
                            placeholder="Выбор города..." defaultOptions
                            label={city => city.name}
                            formatOptionLabel={(label, inputValue) => {
                                const parts = splitBySubstring(label, inputValue);
                                return (<div>
                                    {parts[0]}<span className={classes.searched}>{parts[1]}</span>{parts[2]}
                                </div>)
                            }}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="masterId">Мастер</label>
                    {errors.masterId && (
                        <div className={classes.errorMessage}>{errors.masterId.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="masterId"
                    render={({
                        field: { onChange, value }
                    }) => (
                        <Lookup getOptions={attributes => watch("cityId") && MasterService.getMasters({ ...attributes, cities: [watch("cityId")] })}
                            value={value} onChange={onChange} key={watch("cityId")}
                            defaultValue={order.Master && { value: order.Master.id, label: `${order.Master.name} (${order.Master.User.email})` }}
                            placeholder="Выбор мастера..." defaultOptions
                            label={(master) => `${master.name} (${master.email})`}
                            formatOptionLabel={(label, inputValue) => {
                                const labelArr = label.split(' ');
                                const emailParts = splitBySubstring(labelArr.pop(), inputValue);
                                const nameParts = splitBySubstring(labelArr.join(' '), inputValue);
                                return (<div>
                                    {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                </div>)
                            }}
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
                            from='1' to='3' values={Object.values(WATCH_SIZES_TRANSLATE)}
                            onClick={(event) => onChange(Object.values(WATCH_SIZES)[+event.target.dataset.num - 1])}
                            value={Object.values(WATCH_SIZES).indexOf(value) + 1}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="date">Дата</label>
                    {errors.date && (
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
                            from='10' to='18' count={Object.values(WATCH_SIZES).indexOf(watch("watchSize")) + 1}
                            onClick={(event) => onChange(+event.target.dataset.num)}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="rating">Рейтинг</label>
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
                            options={Object.entries(ORDER_STATUSES_TRANSLATE).map(([value, name]) => ({ value, name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
