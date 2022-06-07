import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/context'
import { MyButton } from '../BlueButton/BlueButton'
import classes from './Navbar.module.css';

export const Navbar = () => {
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const logout = () => {
        setIsAuth(false);
        localStorage.removeItem('auth');
    }

    return (
        <div className={classes.navbar}>
            <div className={classes.navbar__links}>
                <Link className={classes.navbar__link} to="/admin">Главная</Link>
                <Link className={classes.navbar__link} to="/admin/cities">Города</Link>
                <Link className={classes.navbar__link} to="/admin/masters">Мастера</Link>
                <Link className={classes.navbar__link} to="/admin/clients">Клиенты</Link>
                <Link className={classes.navbar__link} to="/admin/orders">Заказы</Link>
                <Link onClick={logout} className={classes.navbar__link} to="/admin/orders">Выйти</Link>
            </div>
        </div>
    )
}
