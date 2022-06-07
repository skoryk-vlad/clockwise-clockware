import React from 'react'
import classes from './MyDatetime.module.css';

export const MyDatetime = (props) => {
  return (
    <input className={classes.myDatetime} {...props}/>
  );
};
