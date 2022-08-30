import React from 'react';
import classes from './MySelect.module.css';

export const MySelect = ({options, value, onChange, ...props}) => {
  return (
    <select className={classes.mySelect}
        value={value}
        onChange={event => onChange(event.target.value)}
        {...props}
    >
        {[ <option className={classes.option} key={null} value={null} disabled selected></option>, ...options.map(option => <option className={classes.option} key={option.value} value={option.value}>{option.name}</option>)]}
    </select>
  )
}
