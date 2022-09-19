import React from 'react';
import { AdminButton } from '../AdminButton/AdminButton';
import { MyModal } from '../modal/MyModal';
import classes from './Confirm.module.css';

export const Confirm = ({ onAccept, onReject, text }) => {
    return (
        <MyModal visible={true} setVisible={() => {}}>
            <div className={classes.confirmWrapper}>
                <h3>{text}</h3>
                <div className={classes.confirmButtons}>
                    <AdminButton onClick={onAccept}>Да</AdminButton>
                    <AdminButton onClick={onReject}>Нет</AdminButton>
                </div>
            </div>
        </MyModal>
    )
}
