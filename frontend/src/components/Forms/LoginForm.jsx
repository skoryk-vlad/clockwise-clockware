import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { Password } from '../Password/Password';
import { useTranslation } from 'react-i18next';
import { Socials } from '../Socials/Socials';

const LoginSchema = z.object({
    email: z.string().trim().min(1, 'errors.email').email('errors.emailFormat').max(255),
    password: z.string().min(1, 'errors.password').min(8, 'errors.passwordLength'),
});

export const LoginForm = ({ user, onClick, loginByService, onError }) => {
    const { t } = useTranslation();

    const { control, handleSubmit, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: user,
        resolver: zodResolver(LoginSchema)
    });
    const onSubmit = loginInfo => onClick(loginInfo);

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                            <MyInput
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
                            <Password
                                name={name}
                                onChange={onChange}
                                value={value}
                                error={error}
                                placeholder={t('authForm.password')}
                            />
                        )}
                    />
                </div>

                <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                    disabled={(isSubmitted && !isValid)}>{t('authForm.loginButton')}</AdminButton>
            </form>
            <Socials
                onSuccess={loginByService}
                onError={onError}
                title={t('authForm.logInByService')}
            />
        </div>
    )
}
