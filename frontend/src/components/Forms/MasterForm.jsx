import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { MASTER_STATUSES, MASTER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';

const MasterSchema = z.object({
    name: z.string().trim().min(1, { message: 'Требуется имя' })
        .min(3, { message: 'Имя должно быть не короче 3-х букв' }).max(255),
    email: z.string().trim().min(1, { message: 'Требуется почта' }).email({ message: 'Неверный формат почты' }).max(255),
    cities: z.array(z.object({
        value: z.number().int().positive()
    })).nonempty('Требуется выбрать хотя бы 1 город'),
    status: z.nativeEnum(MASTER_STATUSES)
});

export const MasterForm = ({ master, onClick, btnTitle, cities }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: master,
        resolver: zodResolver(MasterSchema)
    });
    const onSubmit = () => onClick({ ...getValues(), cities: getValues().cities.map(city => city.value) });

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
                            placeholder="Имя мастера..."
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
                            placeholder="Почта мастера..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="cities">Города</label>
                    {errors.cities && (
                        <div className={classes.errorMessage}>{errors.cities.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="cities"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error },
                    }) => (
                        <Select
                            closeMenuOnSelect={false}
                            defaultValue={master.cities}
                            value={value}
                            isMulti
                            onChange={onChange}
                            options={cities.map(city => ({ value: city.id, label: city.name }))}
                            placeholder='Выбор городов...'
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
                            options={Object.entries(MASTER_STATUSES_TRANSLATE).map(([value, name]) => ({ value, name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
