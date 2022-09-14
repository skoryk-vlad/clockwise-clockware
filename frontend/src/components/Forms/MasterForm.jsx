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

const deleteValueFromArray = (array, value) => {
    array.splice(array.indexOf(parseInt(value)), 1);
    return array;
}

export const MasterForm = ({ master, onClick, btnTitle, cities }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: master,
        resolver: zodResolver(MasterSchema)
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
                            placeholder="Имя мастера..."
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
                        <MySelect multiple={true} size="4"
                            name={name}
                            onChange={(value) => onChange(getValues().cities.includes(parseInt(value)) ? deleteValueFromArray(getValues().cities, +value) : [...getValues().cities, +value])}
                            value={value}
                            error={error}
                            options={cities.map(city => ({ value: city.id, name: city.name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>{btnTitle}</AdminButton>
        </form>
    )
}
