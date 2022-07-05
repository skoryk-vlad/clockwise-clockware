import React from 'react'
import classes from './AdminButton.module.css';

export const AdminButton = ({children, ...props}) => {
  return (
    <button {...props} className={classes.myBtn + ' ' + props.className + ' ' + classes[props.className]}>
        {children}
    </button>
  )
}
