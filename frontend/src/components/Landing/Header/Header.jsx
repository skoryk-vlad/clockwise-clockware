import React from 'react';
import { OrderButton } from '../../OrderButton/OrderButton';
import classes from './Header.module.css';
import { animateScroll as scroll, Link } from "react-scroll";

export const Header = ({ onClick }) => {
    return (
        <header className={classes.header}>
            <div className={classes.header__container + ' container'}>
                <div className={classes.header__logoBlock}>
                    <div onClick={ () => scroll.scrollToTop() } className={classes.header__logo}>
                        <img src="/images/logo.png" alt="Clockwise Clockware" />
                    </div>
                    <div onClick={ () => scroll.scrollToTop() } className={classes.header__title}>Clockwise <br /> Clockware</div>
                </div>
                <nav className={classes.header__menu + ' ' + classes.menuHeader}>
                    <ul className={classes.menuHeader__list}>
                        <li className={classes.menuHeader__item}>
                            <Link className={classes.menuHeader__link}
                            activeClass={classes.active} to="benefits" spy={true}
                                smooth={true} offset={-50} duration={500} >
                                Преимущества
                            </Link>
                        </li>
                        <li className={classes.menuHeader__item}>
                            <Link className={classes.menuHeader__link}
                            activeClass={classes.active} to="etaps" spy={true}
                                smooth={true} offset={-50} duration={500} >
                                Этапы
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className={classes.header__block}>
                    <OrderButton onClick={onClick}>Заказать</OrderButton>
                </div>
            </div>
        </header>
    )
}
