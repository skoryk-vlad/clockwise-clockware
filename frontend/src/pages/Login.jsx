import axios from 'axios';
import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { BlueButton } from '../components/BlueButton/BlueButton';
import { MyInput } from '../components/input/MyInput';
import { MyModal } from '../components/modal/MyModal';
import { AuthContext } from '../context/context'
import '../styles/App.css';
import '../styles/reset.css';

export const Login = () => {

    const {isAuth, setIsAuth} = useContext(AuthContext);
    const [redirect, setRedirect] = useState({ redirect: false });
    const [modal, setModal] = useState(false);

    const [authInfo, setAuthInfo] = useState({
        login: '',
        password: ''
    });

    const login = async event => {
        event.preventDefault();
        const isRight = await axios.post('/auth', {
            params: authInfo
        });
        if(isRight.data) {
            setIsAuth(true);
            localStorage.setItem('auth', 'true');
            setRedirect({ redirect: true });
        } else {
            setModal(true);
        }
    }

    if (redirect.redirect) {
        return <Navigate push to="/admin" />
    }

    return (
        <div className='login'>
            <h1>Страница входа</h1>
            <form onSubmit={login}>
                <MyInput value={authInfo.login} onChange={e => setAuthInfo({...authInfo, login: e.target.value})} type="text" placeholder="Введите логин" />
                <MyInput value={authInfo.password} onChange={e => setAuthInfo({...authInfo, password: e.target.value})} type="password" placeholder="Введите пароль" />
                <BlueButton>Войти</BlueButton>
            </form>
            <MyModal visible={modal} setVisible={setModal}><p style={{fontSize: '20px'}}>Данные введены неверно. Попробуйте еще раз</p></MyModal>
        </div>
    )
}
