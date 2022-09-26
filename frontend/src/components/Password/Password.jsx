import React from 'react';
import { useState } from 'react';
import { MyInput } from '../input/MyInput';
import classes from './Password.module.css';

export const Password = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className={classes.passwordWrapper}>
            <MyInput {...props} type={visible ? "text" : "password"} />
            <div onClick={() => setVisible(!visible)} className={classes.toggler}>&#x1F441;</div>
        </div>
    )
}
