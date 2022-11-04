import React from 'react';
import { useTranslation } from 'react-i18next';
import { AdminButton } from '../AdminButton/AdminButton';
import { MyModal } from '../modal/MyModal';
import classes from './ConfirmationModal.module.css';

export const ConfirmationModal = ({ onAccept, onReject, text }) => {
    const { t } = useTranslation();

    return (
        <MyModal visible={true} setVisible={() => { }}>
            <div className={classes.confirmWrapper}>
                <h3>{text}</h3>
                <div className={classes.confirmButtons}>
                    <AdminButton onClick={onAccept}>{t('notifications.yes')}</AdminButton>
                    <AdminButton onClick={onReject}>{t('notifications.no')}</AdminButton>
                </div>
            </div>
        </MyModal>
    )
}
