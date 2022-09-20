import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import classes from './Form.module.css';
import { AdminButton } from '../AdminButton/AdminButton';
import { MySelect } from '../select/MySelect';
import { ORDER_MASTER_STATUSES, ORDER_MASTER_STATUSES_TRANSLATE } from '../../constants';

const ChangeStatusMasterSchema = z.object({
    status: z.nativeEnum(ORDER_MASTER_STATUSES)
});

export const ChangeStatusMasterForm = ({ order, onClick }) => {
    const { control, handleSubmit, getValues, formState: { errors, isSubmitted, isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: order,
        resolver: zodResolver(ChangeStatusMasterSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
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
                            options={Object.entries(ORDER_MASTER_STATUSES_TRANSLATE).map(([value, name]) => ({ value, name }))}
                        />
                    )}
                />
            </div>

            <AdminButton type="submit" className={(isSubmitted && !isValid) ? "disabledBtn" : ""}
                disabled={(isSubmitted && !isValid)}>Изменить</AdminButton>
        </form>
    )
}
