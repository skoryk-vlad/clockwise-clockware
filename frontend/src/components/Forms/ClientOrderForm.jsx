import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { NumPicker } from '../NumPicker/NumPicker';
import { formatISO, getHours, addHours } from 'date-fns'
import { WATCH_SIZES, WATCH_SIZES_TRANSLATE } from '../../constants';
import { useEffect } from 'react';
import { useState } from 'react';
import { notify, NOTIFY_TYPES } from '../Notifications';

const date = new Date();
const minDate = formatISO(date, { representation: 'date' });
const minTime = getHours(addHours(date, 2));

const ClientOrderSchema = z.object({
    name: z.string().trim().min(1, { message: 'Требуется имя' }).min(3, { message: 'Имя должно быть не короче 3-х букв' }).max(255),
    email: z.string().trim().min(1, { message: 'Требуется почта' }).email({ message: 'Неверный формат почты' }).max(255),
    watchSize: z.nativeEnum(WATCH_SIZES),
    cityId: z.number({ invalid_type_error: 'Требуется выбрать город' }).int('asd').positive('fgh'),
    date: z.preprocess(value => ((typeof value === "string" || value instanceof Date) && value !== '') && new Date(value),
        z.date({ invalid_type_error: 'Требуется выбрать дату' })),
    time: z.number({ invalid_type_error: 'Требуется выбрать время' }).int().min(10).max(18)
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
    if (order.date === minDate && order.time < minTime) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['date'],
            message: "Выбрано неверное время или размер часов для текущей даты",
        });
    }
});

export const ClientOrderForm = ({ order, onClick, cities }) => {
    const [fileDataURLs, setFileDataURLs] = useState([]);
    const { control, handleSubmit, getValues, setValue, watch, formState: { errors, isValid, isSubmitted } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: order,
        resolver: zodResolver(ClientOrderSchema)
    });
    const onSubmit = () => onClick(getValues());

    useEffect(() => {
        setValue('price', cities.find(city => city.id === watch('cityId'))?.price * (Object.values(WATCH_SIZES).indexOf(watch('watchSize')) + 1));
    }, [watch('cityId'), watch('watchSize')]);

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
                            from='10' to='18' count={Object.values(WATCH_SIZES).indexOf(watch("watchSize")) + 1}
                            min={watch('date') ? (watch('date') === minDate ? minTime : 0) : 19}
                            onClick={(event) => onChange(+event.target.dataset.num)}
                            value={value}
                            error={error}
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="images">Фото</label>
                    {errors.time && !isValid && (
                        <div className={classes.errorMessage}>{errors.time.message}</div>
                    )}
                </div>
                <Controller
                    name="images"
                    control={control}
                    defaultValue={[]}
                    render={({
                        field: { onChange, value }
                    }) => {
                        return (
                            <>
                                <div className={classes.fileUpload}>
                                    <input
                                        type="file" id="images" multiple
                                        accept=".jpеg,.jpg,.png"
                                        value={value.filename}
                                        onChange={(event) => {
                                            const files = Array.from(event.target.files).filter(file => {
                                                if (!file.type.includes('image/')) {
                                                    notify(NOTIFY_TYPES.ERROR, 'Прикрепить можно только фото!');
                                                    return false;
                                                }
                                                if (file.size > 1048576) {
                                                    notify(NOTIFY_TYPES.ERROR, 'Размер фото не должен превышать 1 Мб!');
                                                    return false;
                                                }
                                                return true;
                                            });
                                            if (files.length > 5) {
                                                files.splice(5, files.length);
                                                notify(NOTIFY_TYPES.ERROR, 'Прикрепить можно не более 5 фото!');
                                            };
                                            const dataFiles = new DataTransfer();

                                            setFileDataURLs([]);

                                            files.forEach(file => {
                                                dataFiles.items.add(file);

                                                const reader = new FileReader();
                                                reader.onload = (e) => setFileDataURLs(FileDataURLs => [...FileDataURLs, { FileDataURL: e.target.result, name: file.name }]);
                                                reader.readAsDataURL(file);
                                            });

                                            onChange(dataFiles.files);
                                        }}
                                    />
                                    <label htmlFor="images">Прикрепить фото</label>
                                </div>
                                {fileDataURLs.length > 0 && <div className={classes.images}>
                                    {fileDataURLs.map((fileDataURL, index) => <div className={classes.image} key={index}>
                                        <div className={classes.imageContainer} style={{ backgroundImage: `url(${fileDataURL.FileDataURL})` }}></div>
                                        <div className={classes.return} onClick={() => {
                                            const images = Array.from(watch().images).filter(image => image.name !== fileDataURL.name);
                                            const dataFiles = new DataTransfer();
                                            images.forEach(image => dataFiles.items.add(image));
                                            setFileDataURLs(fileDataURLs.filter(fileData => fileData.name !== fileDataURL.name));

                                            onChange(dataFiles.files);
                                        }}>
                                            <img src="/images/icons/close.png" alt="Удалить" />
                                        </div>
                                    </div>)}
                                </div>}
                            </>
                        );
                    }}
                />
            </div>

            <div className={classes.formBottom}>
                <AdminButton type="submit" className={((isSubmitted && Object.keys(errors).length)) ? "disabledBtn" : ""}
                    disabled={((isSubmitted && Object.keys(errors).length))}>Оформить заказ</AdminButton>
                <div className={classes.orderPrice}>Цена: {watch('price') || 0}</div>
            </div>
        </form>
    )
}
