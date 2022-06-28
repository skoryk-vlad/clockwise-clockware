import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import Server from '../API/Server';
import { OrderButton } from '../components/OrderButton/OrderButton';
import { MyInput } from '../components/input/MyInput';
import { MyModal } from '../components/modal/MyModal';
import { AuthContext } from '../context/context'
import '../styles/App.css';
import '../styles/reset.css';
import { Helmet } from 'react-helmet';

export const Login = () => {

    // const {isAuth, setIsAuth} = useContext(AuthContext);
    const [redirect, setRedirect] = useState({ redirect: false });
    const [modal, setModal] = useState(false);
    const [error, setError] = useState('');
    const {isAuth, setIsAuth} = useContext(AuthContext);

    const [authInfo, setAuthInfo] = useState({
        login: 'admin@example.com',
        password: 'passwordsecret'
    });

    const login = async event => {
        event.preventDefault();
        const data = await Server.auth(authInfo);
        if(data.token) {
            localStorage.setItem('token', data.token);
            setIsAuth(true);
            setRedirect({ redirect: true });
        } else {
            localStorage.removeItem('token');
            setError(data.response.data.message);
            setModal(true);
        }
    }

    if (redirect.redirect) {
        return <Navigate push to="/admin/main" />
    }

    return (
        <div className='login'>
            {/* <Helmet>
                <title>Авторизация - Clockwise Clockware</title>
            </Helmet> */}
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
