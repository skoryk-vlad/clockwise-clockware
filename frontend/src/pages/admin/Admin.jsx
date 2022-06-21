import React from 'react'
import { Helmet } from 'react-helmet';
import { Navbar } from '../../components/Navbar/Navbar'
import '../../styles/App.css';

export const Admin = () => {
    return (
        <div className='admin-container'>
            {/* <Helmet>
                <title>Админ-панель - Clockwise Clockware</title>
            </Helmet> */}
            <Navbar/>
            <div className='admin-body'>
                <h1 className='admin-body__title'>Главная</h1>
                
            </div>
        </div>
    )
}