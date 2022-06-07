import React from 'react';
import classes from './MyRadio.module.css';

export const MyRadio = ({ children, name, id, checked }) => {
  return (
    <div className={classes.myRadio__cont}>
        <input className={classes.myRadio} type="radio" name={name} id={id} defaultChecked={checked}/>
        <label htmlFor={id}>
          {children}
        </label>
    </div>
  )
}
