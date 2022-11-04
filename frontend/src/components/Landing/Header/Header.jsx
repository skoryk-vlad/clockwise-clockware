import React from 'react';
import { OrderButton } from '../../OrderButton/OrderButton';
import classes from './Header.module.css';
import { Link } from "react-scroll";
import { LanguageSwitcher } from '../../LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Header = ({ register, login, isButtonsVisible = true }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <header className={classes.header}>
            <div className={classes.header__container + ' container'}>
                <div className={classes.header__logoBlock}>
                    <div onClick={() => navigate('/')} className={classes.header__logo}>
                        <img src="/images/logo.png" alt="Clockwise Clockware" />
                    </div>
                    <div onClick={() => navigate('/')} className={classes.header__title}>Clockwise <br /> Clockware</div>
                </div>
                {isButtonsVisible && <>
                    <nav className={classes.header__menu + ' ' + classes.menuHeader}>
                        <ul className={classes.menuHeader__list}>
                            <li className={classes.menuHeader__item}>
                                <Link className={classes.menuHeader__link}
                                    activeClass={classes.active} to="benefits" spy={true}
                                    smooth={true} offset={-50} duration={500} >
                                    {t('header.advantages')}
                                </Link>
                            </li>
                            <li className={classes.menuHeader__item}>
                                <Link className={classes.menuHeader__link}
                                    activeClass={classes.active} to="etaps" spy={true}
                                    smooth={true} offset={-50} duration={500} >
                                    {t('header.stages')}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <div className={classes.header__block}>
                        <OrderButton onClick={register}>{t('signUp')}</OrderButton>
                        <OrderButton onClick={login}>{t('logIn')}</OrderButton>
                    </div>
                </>}
                <LanguageSwitcher />
            </div>
        </header>
    )
}
