import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import Select from 'react-select';
import { Password } from '../Password/Password';

const RegistrationSchema = z.object({
    name: z.string().trim().min(1, 'Требуется имя')
        .min(3, 'Название должно быть не короче 3-х букв').max(255),
    email: z.string().trim().min(1, 'Требуется почта').email('Неверный формат почты').max(255),
    password: z.string().min(1, 'Требуется пароль').min(8, 'Слишком короткий'),
    isAgree: z.boolean().refine(isAgree => isAgree === true, 'Необходимо согласиться с условиями'),
    isMaster: z.boolean().optional(),
    cities: z.array(z.number().int().positive())
}).refine(account => (account.isMaster && account.cities.length > 0) || !account.isMaster, {
    path: ['cities'],
    message: 'Выберите хотя бы один город'
});

export const RegistrationForm = ({ user, onClick, btnTitle, cities }) => {
    const { control, handleSubmit, getValues, watch, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: user,
        resolver: zodResolver(RegistrationSchema)
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
                            placeholder="Имя..."
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
                            placeholder="Почта..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="password">Пароль</label>
                    {errors.password && (
                        <div className={classes.errorMessage}>{errors.password.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="password"
                    render={({
                        field: { onChange, value, name },
                        fieldState: { error },
                    }) => (
                        <Password
                            name={name}
                            onChange={onChange}
                            value={value}
                            error={error}
                            placeholder="Пароль..."
                        />
                    )}
                />
            </div>
            <div className={classes.formRow}>
                <div className={classes.checkboxWrapper}>
                    <Controller
                        control={control}
                        name="isMaster"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error },
                        }) => (
                            <MyInput
                                type="checkbox" name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                            />
                        )}
                    />
                    <label htmlFor="isMaster">Зарегистрироваться как мастер</label>
                    {errors.isMaster && (
                        <div className={classes.checkboxError}>{errors.isMaster.message}</div>
                    )}
                </div>
            </div>

            {watch('isMaster') &&
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
                            field: { onChange },
                            fieldState: { error },
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                value={cities.filter(city => watch('cities').includes(city.id)).map(city => ({ value: city.id, label: city.name }))}
                                isMulti
                                error={error}
                                onChange={options => onChange(options.map(option => option.value))}
                                options={cities.map(city => ({ value: city.id, label: city.name }))}
                                placeholder='Выбор городов...'
                            />
                        )}
                    />
                </div>}


            <div className={classes.formRow}>
                <div className={classes.checkboxWrapper}>
                    <Controller
                        control={control}
                        name="isAgree"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error },
                        }) => (
                            <MyInput
                                type="checkbox" name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                            />
                        )}
                    />
                    <label htmlFor="isAgree" className={classes.isAgreeMessage}>Согласен со всеми условиями</label>
                    {errors.isAgree && (
                        <div className={classes.checkboxError}>{errors.isAgree.message}</div>
                    )}
                </div>
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
