import React from 'react';
import { Controller, useForm } from "react-hook-form";
import classes from './Form.module.css';
import { z } from 'zod';
import { AdminButton } from '../AdminButton/AdminButton';
import { MASTER_STATUSES, MASTER_STATUSES_TRANSLATE } from '../../constants';
import Select from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lookup, splitBySubstring } from '../Lookup/Lookup';
import { MasterService } from '../../API/Server';

const MasterFilterSchema = z.object({
    cities: z.array(z.number().int().positive()).optional(),
    statuses: z.array(z.nativeEnum(MASTER_STATUSES)).optional(),
    masters: z.array(z.number().int().positive()).optional()
});

export const MasterFilterForm = ({ filters, onClick, cities, setFilters }) => {
    const { control, handleSubmit, watch, getValues, reset, formState: { isValid } } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: filters,
        resolver: zodResolver(MasterFilterSchema)
    });
    const onSubmit = () => onClick(getValues());

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.filterForm}>
            <div className={classes.filterFormRow}>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="masters">Мастера</label>
                    </div>
                    <Controller
                        control={control}
                        name="masters"
                        render={({
                            field: { onChange, value }
                        }) => (
                            <Lookup getOptions={MasterService.getMasters}
                                value={value} onChange={onChange}
                                placeholder="Выбор мастеров..." isMulti
                                label={(master) => `${master.name} (${master.email})`}
                                formatOptionLabel={(label, inputValue) => {
                                    const labelArr = label.split(' ');
                                    const emailParts = splitBySubstring(labelArr.pop(), inputValue);
                                    const nameParts = splitBySubstring(labelArr.join(' '), inputValue);
                                    return (<div>
                                        {nameParts[0]}<span className={classes.searched}>{nameParts[1]}</span>{nameParts[2]} <span className={classes.email}>{emailParts[0]}<span className={classes.searched}>{emailParts[1]}</span>{emailParts[2]}</span>
                                    </div>)
                                }}
                            />
                        )}
                    />
                </div>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="cities">Города</label>
                    </div>
                    <Controller
                        control={control}
                        name="cities"
                        render={({
                            field: { onChange }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filters.cities}
                                value={cities.filter(city => watch('cities').includes(city.id)).map(city => ({ value: city.id, label: city.name }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
                                options={cities.map(city => ({ value: city.id, label: city.name }))}
                                placeholder='Выбор городов...'
                            />
                        )}
                    />
                </div>
                <div className={classes.rowColumn}>
                    <div className={classes.rowTop}>
                        <label htmlFor="statuses">Статусы</label>
                    </div>
                    <Controller
                        control={control}
                        name="statuses"
                        render={({
                            field: { onChange }
                        }) => (
                            <Select
                                closeMenuOnSelect={false}
                                defaultValue={filters.statuses}
                                value={Object.entries(MASTER_STATUSES_TRANSLATE).filter(status => watch('statuses').includes(status[0])).map(([value, label]) => ({ value, label }))}
                                isMulti
                                onChange={options => onChange(options.map(option => option.value))}
                                options={Object.entries(MASTER_STATUSES_TRANSLATE).map(([value, label]) => ({ value, label }))}
                                placeholder='Выбор статусов...'
                            />
                        )}
                    />
                </div>

                <div className={classes.filterButton}>
                    <AdminButton type="submit" disabled={!isValid}>Фильтровать</AdminButton>
                    <AdminButton type="button" onClick={() => { reset(); setFilters(filters); }}>Сбросить</AdminButton>
                </div>
            </div>
        </form>
    )
}
