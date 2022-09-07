import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';

const MasterSchema = z.object({
    name: z.string().trim().min(1, {
        message: 'Требуется имя'
    }).min(3, {
        message: 'Имя должно быть не короче 3-х букв'
    }).max(255),
    cities: z.array(z.number().int().positive()).nonempty({
        message: 'Требуется выбрать хотя бы 1 город'
    })
});

export const MasterForm = ({ values, onClick, btnTitle, cities }) => {
    const deleteValueFromArray = (array, value) => {
        array.splice(array.indexOf(parseInt(value)), 1);
        return array;
    }

    const { control, handleSubmit, getValues, setValue, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'onBlur',
        defaultValues: values,
        resolver: zodResolver(MasterSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.formRow}>
                <div className={classes.rowTop}>
                    <label htmlFor="name">Имя</label>
                    {errors.name && touchedFields.name && (
                        <div className={classes.errorMessage}>{errors.name.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="name"
                    render={({
                        field: { onChange, onBlur, value, name },
                        fieldState: { error }
                    }) => (
                        <MyInput
                            type="text" name={name}
                            onBlur={onBlur}
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
                    <label htmlFor="cities">Города</label>
                    {errors.cities && touchedFields.cities && (
                        <div className={classes.errorMessage}>{errors.cities.message}</div>
                    )}
                </div>
                <Controller
                    control={control}
                    name="cities"
                    render={({
                        field: { onBlur, value, name },
                        fieldState: { error },
                    }) => (
                        <MySelect multiple={true} size="4"
                            name={name}
                            onBlur={onBlur}
                            onChange={val => setValue('cities', getValues().cities.includes(parseInt(val)) ? deleteValueFromArray(getValues().cities, +val) : [...getValues().cities, +val])}
                            value={value}
                            error={error}
                            options={cities.map(city => ({ value: city.id, name: city.name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={!(isDirty && isValid) ? "disabledBtn" : ""}
                disabled={!(isDirty && isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
