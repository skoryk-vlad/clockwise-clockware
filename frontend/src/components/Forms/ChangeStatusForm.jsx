import React from 'react';
import { MyInput } from '../input/MyInput';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';

const ChangeStatusSchema = z.object({
    rating: z.number({invalid_type_error: 'Рейтинг должен быть числом'}).int().min(0, 'Рейтинг должен находиться в диапазоне 0-5').max(5, 'Рейтинг должен находиться в диапазоне 0-5'),
    statusId: z.number({invalid_type_error: 'Требуется выбрать статус'}).int().min(1).max(4)
});

export const ChangeStatusForm = ({ values, onClick, statuses }) => {
    const { control, handleSubmit, getValues, setValue, formState: { errors, isDirty, isValid, touchedFields } } = useForm({
        mode: 'onChange',
        defaultValues: values,
        resolver: zodResolver(ChangeStatusSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                disabled={!(isDirty && isValid)}>Изменить</AdminButton>
        </form>
    )
}
