import React from 'react'
import classes from './OrderButton.module.css';

export const OrderButton = ({ children, onClick, className, ...props }) => {
  return (
    <button onClick={onClick} {...props}
      className={`${classes.myBtn}${className ? ` ${className + ' ' + classes[className]}` : ''}`}
    >
      {children}
    </button>
  )
}
