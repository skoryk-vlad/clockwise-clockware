import React from 'react'
import classes from './OrderButton.module.css';

export const OrderButton = ({children, ...props}) => {
  return (
    <button {...props} className={classes.myBtn + ' ' + classes[props.className]}>
        {children}
    </button>
  )
}
