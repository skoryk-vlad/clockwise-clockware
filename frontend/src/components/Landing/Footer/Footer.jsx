import React from 'react';
import classes from './Footer.module.css';
import { animateScroll as scroll } from "react-scroll";
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <main className={classes.footer}>
            <div className={classes.footer__container + ' container'}>
                <div className={classes.footer__logoBlock}>
                    <div onClick={ () => scroll.scrollToTop() } className={classes.footer__logo}>
                        <img src="/images/logo.png" alt="Clockwise Clockware" />
                    </div>
                    <div onClick={ () => scroll.scrollToTop() } className={classes.footer__title}>Clockwise <br /> Clockware</div>
                </div>
                <div className={classes.contacts}>
                    <h4>{t('contacts')}</h4>
                    <div className={classes.contacts__list}>
                        <a href='tel:+380730755750'>+38 (073) 0-755-750</a>
                        <a href={`mailto:${process.env.REACT_APP_EMAIL}`}>{process.env.REACT_APP_EMAIL}</a>
                    </div>
                </div>
            </div>
        </main>
    )
}
