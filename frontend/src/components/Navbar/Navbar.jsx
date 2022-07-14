import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/context';
import classes from './Navbar.module.css';

export const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('token');
    }

    return (
        <div className={classes.navbar}>
            <div className={classes.logo}>LOGO</div>
            <div className={classes.navbar__links}>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/main">Главная</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/cities">Города</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/masters">Мастера</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/clients">Клиенты</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/orders">Заказы</NavLink>
                <NavLink className = { navData => navData.isActive ? [classes.active, classes.navbar__link].join(' ') : classes.navbar__link } to="/admin/city-master">Мастера по городам</NavLink>
                <NavLink onClick={logout} className={classes.navbar__link} to="/">Выйти</NavLink>
            </div>
        </div>
    )
}
