import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthService } from '../API/Server';
import { OrderButton } from '../components/OrderButton/OrderButton';
import { MyInput } from '../components/input/MyInput';
import { MyModal } from '../components/modal/MyModal';
import '../styles/App.css';
import '../styles/reset.css';
import { useEffect } from 'react';

export const Login = () => {

    const [redirect, setRedirect] = useState(false);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState('');

    const [authInfo, setAuthInfo] = useState({
        login: 'admin@example.com',
        password: 'passwordsecret'
    });

    useEffect(() => {
        document.title = "Авторизация - Clockwise Clockware";
    }, []);

    const login = async event => {
        event.preventDefault();
        const data = await AuthService.auth(authInfo);
        if(data.token) {
            localStorage.setItem('token', data.token);
            setRedirect(true);
        } else {
            localStorage.removeItem('token');
            setError(data.response.data.message);
            setModal(true);
        }
    }

    if (redirect) {
        return <Navigate push to="/admin/main" />
    }

    return (
        <div className='login'>
            <h1>Страница входа</h1>
            <form onSubmit={login}>
                <MyInput value={authInfo.login} onChange={e => setAuthInfo({...authInfo, login: e.target.value})} type="text" placeholder="Введите логин" />
                <MyInput value={authInfo.password} onChange={e => setAuthInfo({...authInfo, password: e.target.value})} type="password" placeholder="Введите пароль" />
                <OrderButton>Войти</OrderButton>
            </form>
            <MyModal visible={modal} setVisible={setModal}><p style={{fontSize: '20px'}}>{error}. Попробуйте еще раз</p></MyModal>
        </div>
    )
}
