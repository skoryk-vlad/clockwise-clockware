import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import Select from 'react-select';
import { Password } from '../Password/Password';
import { useTranslation } from 'react-i18next';
import { Socials } from '../Socials/Socials';

const RegistrationSchema = z.object({
    name: z.string().trim().min(1, 'errors.name')
        .min(3, 'errors.nameLength').max(255),
    email: z.string().trim().min(1, 'errors.email').email('errors.emailFormat').max(255),
    password: z.string().min(1, 'errors.password').min(8, 'errors.passwordLength'),
    isAgree: z.boolean().refine(isAgree => isAgree === true, 'errors.agreeWithTerms'),
    isMaster: z.boolean().optional(),
    cities: z.array(z.number().int().positive())
}).refine(account => (account.isMaster && account.cities.length > 0) || !account.isMaster, {
    path: ['cities'],
    message: 'errors.cities'
});

export const RegistrationForm = ({ user, onClick, cities, registerByService, onError }) => {
    const { t } = useTranslation();

    const { control, handleSubmit, getValues, watch, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: user,
        resolver: zodResolver(RegistrationSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                    <div className={classes.rowTop}>
                        <label htmlFor="name">{t('authForm.name')}</label>
                        {errors.name && (
                            <div className={classes.errorMessage}>{t(errors.name.message)}</div>
                        )}
                    </div>
                    <Controller
                        control={control}
                        name="name"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error }
                        }) => (
                            <MyInput id={name}
                                type="text" name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                                placeholder={t('authForm.name')}
                            />
                        )}
                    />
                </div>
                <div className={classes.formRow}>
                    <div className={classes.rowTop}>
                        <label htmlFor="email">{t('authForm.email')}</label>
                        {errors.email && (
                            <div className={classes.errorMessage}>{t(errors.email.message)}</div>
                        )}
                    </div>
                    <Controller
                        control={control}
                        name="email"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error },
                        }) => (
                            <MyInput id={name}
                                type="text" name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                                placeholder={t('authForm.email')}
                            />
                        )}
                    />
                </div>
                <div className={classes.formRow}>
                    <div className={classes.rowTop}>
                        <label htmlFor="password">{t('authForm.password')}</label>
                        {errors.password && (
                            <div className={classes.errorMessage}>{t(errors.password.message)}</div>
                        )}
                    </div>
                    <Controller
                        control={control}
                        name="password"
                        render={({
                            field: { onChange, value, name },
                            fieldState: { error },
                        }) => (
                            <Password id={name}
                                name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                                placeholder={t('authForm.password')}
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
                                <MyInput id={name}
                                    type="checkbox" name={name}
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                />
                            )}
                        />
                        <label htmlFor="isMaster">{t('authForm.asMaster')}</label>
                        {errors.isMaster && (
                            <div className={classes.checkboxError}>{errors.isMaster.message}</div>
                        )}
                    </div>
                </div>

                {watch('isMaster') &&
                    <div className={classes.formRow}>
                        <div className={classes.rowTop}>
                            <label htmlFor="cities">{t('authForm.cities')}</label>
                            {errors.cities && (
                                <div className={classes.errorMessage}>{t(errors.cities.message)}</div>
                            )}
                        </div>
                        <Controller
                            control={control}
                            name="cities"
                            render={({
                                field: { onChange },
                                fieldState: { error },
                            }) => (
                                <Select className={classes.select}
                                    closeMenuOnSelect={false}
                                    value={cities.filter(city => watch('cities').includes(city.id)).map(city => ({ value: city.id, label: city.name }))}
                                    isMulti
                                    error={error}
                                    onChange={options => onChange(options.map(option => option.value))}
                                    options={cities.map(city => ({ value: city.id, label: city.name }))}
                                    placeholder={t('authForm.cities')}
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
                                <MyInput id={name}
                                    type="checkbox" name={name}
                                    onChange={onChange}
                                    value={value}
                                    error={error}
                                />
                            )}
                        />
                        <label htmlFor="isAgree" className={classes.isAgreeMessage}>{t('authForm.agreeWithTerms')}</label>
                        {errors.isAgree && (
                            <div className={classes.checkboxError}>{t(errors.isAgree.message)}</div>
                        )}
                    </div>
                </div>

                <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                    disabled={(isSubmitted && !isValid)}>{t('authForm.signUpButton')}</AdminButton>
            </form>
            <Socials
                onSuccess={userInfo => registerByService(userInfo, watch('isMaster'), watch('cities'))}
                onError={onError}
                title={t('authForm.signUpByService')}
            />
        </div>
    )
}
