import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import classes from './Message.module.css';

export const Message = ({ setMessage, message }) => {
    const [messageClasses, setMessageClasses] = useState([classes.message, classes[message.color]]);

    useEffect(() => {
        setMessageClasses([...messageClasses, classes.show]);
        setTimeout(() => {
            setMessageClasses([classes.message]);
            setTimeout(() => {
                setMessage({...message, show: false});
            }, 1000);
        }, 10000);
    }, []);

    return (
        <div className={classes.messageWrapper}>
            <div className={messageClasses.join(' ')}>
                {message.message}
            </div>
        </div>
    )
}
