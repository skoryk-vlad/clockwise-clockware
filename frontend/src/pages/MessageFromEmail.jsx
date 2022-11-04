import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Header } from '../components/Landing/Header/Header';
import { OrderButton } from '../components/OrderButton/OrderButton';

export const MessageFromEmail = ({ messageKey }) => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = `${t('messageFromEmail')} - Clockwise Clockware`;
    }, [i18n.language]);

    return (
        <>
            <Header isButtonsVisible={false} />
            <div className='messageFromEmailWrapper'>
                <div className='messageFromEmail'>
                    <p>{t(messageKey)}</p>
                    <NavLink to="/"><OrderButton>{t('returnButton')}</OrderButton></NavLink>
                </div>
            </div>
        </>
    )
}
