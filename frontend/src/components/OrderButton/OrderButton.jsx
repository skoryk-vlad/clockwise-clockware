import React from 'react'
import classes from './OrderButton.module.css';

export const OrderButton = ({children, ...props}) => {
  console.log();
  return (
    <button {...props} className={classes.myBtn + ' ' + props.className + ' ' + classes[props.className]}>
        {children}
    </button>
  )
}
