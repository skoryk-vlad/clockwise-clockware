import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Navbar.module.css';

export const Navbar = ({ role }) => {
    const logout = () => {
        localStorage.removeItem('token');
    }

    return (
        <div className={classes.navbar}>
            <div className={classes.logo}>
                <img src="../images/logo.png" alt="" />
                <p>Clockwise Clockware</p>
            </div>
            {role === 'admin' &&
                <div className={classes.navbar__links}>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/admin/main">Главная</NavLink>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/admin/cities">Города</NavLink>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/admin/masters">Мастера</NavLink>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/admin/clients">Клиенты</NavLink>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/admin/orders">Заказы</NavLink>
                    <NavLink onClick={logout} className={classes.navbar__link} to="/">Выйти</NavLink>
                </div>
            }
            {role === 'master' &&
                <div className={classes.navbar__links}>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/master/main">Заказы</NavLink>
                    <NavLink onClick={logout} className={classes.navbar__link} to="/">Выйти</NavLink>
                </div>
            }
            {role === 'client' &&
                <div className={classes.navbar__links}>
                    <NavLink className={navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link} to="/client/main">Заказы</NavLink>
                    <NavLink onClick={logout} className={classes.navbar__link} to="/">Выйти</NavLink>
                </div>
            }
        </div>
    )
}
