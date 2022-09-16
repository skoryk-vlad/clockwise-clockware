import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthService } from '../API/Server';
import { OrderButton } from '../components/OrderButton/OrderButton';
import { MyInput } from '../components/input/MyInput';
import { MyModal } from '../components/modal/MyModal';
import '../styles/App.css';
import '../styles/reset.css';
import { useEffect } from 'react';
import { jwtPayload } from '../components/PrivateRoute';

export const Login = () => {
    const [redirect, setRedirect] = useState(false);
    const [modal, setModal] = useState(false);
    const [error, setError] = useState('');
    const [path, setPath] = useState('');

    const [authInfo, setAuthInfo] = useState({
        email: 'admin@example.com',
        password: 'passwordsecret'
    });

    useEffect(() => {
        document.title = "Авторизация - Clockwise Clockware";
    }, []);
    
    const login = async event => {
        event.preventDefault();
        const loginInfo = await AuthService.auth(authInfo);
        if (loginInfo.token) {
            localStorage.setItem('token', loginInfo.token);
            setPath(jwtPayload(loginInfo.token).role);
            setRedirect(true);
        } else {
            setError(loginInfo.response.data.message);
            setModal(true);
        }
    }

    return (
        redirect ?
            <Navigate push to={`/${path}/main`} />
            :
            <div className='login'>
                <h1>Страница входа</h1>
                <form onSubmit={login}>
                    <MyInput value={authInfo.email} onChange={event => setAuthInfo({ ...authInfo, email: event.target.value })} type="text" placeholder="Введите логин" />
                    <MyInput value={authInfo.password} onChange={event => setAuthInfo({ ...authInfo, password: event.target.value })} type="password" placeholder="Введите пароль" />
                    <OrderButton>Войти</OrderButton>
                </form>
                <MyModal visible={modal} setVisible={setModal}><p style={{ fontSize: '20px' }}>{error}. Попробуйте еще раз</p></MyModal>
            </div>
    )
}
