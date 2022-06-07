import React from 'react'
import classes from './BlueButton.module.css';

export const BlueButton = ({children, ...props}) => {
  return (
    <button {...props} className={classes.myBtn}>
        {children}
    </button>
  )
}
