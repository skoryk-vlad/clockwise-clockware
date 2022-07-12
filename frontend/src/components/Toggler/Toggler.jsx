import React from 'react'
import classes from './Toggler.module.css';

export const Toggler = ({ value, titles, onClick, ...props  }) => {
    const val = String(value) === 'true' ? true : false;
    
    return (
        <button type='button' {...props} className={classes.toggler + (val ? ' ' + classes.active : '')} data-state={!val} onClick={onClick}>
            {val ? titles[0].toString() : titles[1].toString()}
        </button>
    )
}
