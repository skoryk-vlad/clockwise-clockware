import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';

const CityMasterSchema = z.object({
    masterId: z.number({ invalid_type_error: 'Требуется выбрать мастера' }).int().positive(),
    cityId: z.number({ invalid_type_error: 'Требуется выбрать город' }).int().positive()
});

export const CityMasterForm = ({ cityMaster, onClick, btnTitle, cities, masters }) => {
    const { control, handleSubmit, getValues, setValue, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'all',
        defaultValues: cityMaster,
        resolver: zodResolver(CityMasterSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                            options={masters.map(master => ({ value: master.id, name: master.name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
