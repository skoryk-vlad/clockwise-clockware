import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/context';
import classes from './Navbar.module.css';

export const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    }

    return (
        <div className={classes.navbar}>
            <div className={classes.logo}>
                <img src="../images/logo.png" alt="" />
                <p>Clockwise Clockware</p>
            </div>
            <div className={classes.navbar__links}>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/main">Главная</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/cities">Города</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/masters">Мастера</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/clients">Клиенты</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/orders">Заказы</NavLink>
                <NavLink onClick={logout} className={classes.navbar__link} to="/">Выйти</NavLink>
            </div>
        </div>
    )
}
