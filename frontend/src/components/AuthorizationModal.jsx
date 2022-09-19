import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService, CityService, ClientService, MasterService } from '../API/Server';
import { CLIENT_STATUSES } from '../constants';
import { useFetching } from '../hooks/useFetching';
import { Confirm } from './Confirm/Confirm';
import { LoginForm } from './Forms/LoginForm';
import { RegistrationForm } from './Forms/RegistrationForm';
import { jwtPayload } from './PrivateRoute';

const defaultUser = {
    name: '',
    email: '',
    password: '',
    isAgree: false,
    isMaster: false,
    cities: [],
    status: Object.keys(CLIENT_STATUSES)[0]
}

export const AuthorizationModal = ({ isRegistration, needRedirect = true, setIsAuthorizationModalOpened, setMessage }) => {
    const [redirect, setRedirect] = useState({ isRedirect: false, path: '' });

    const [isConfirmOpened, setIsConfirmOpened] = useState(false);
    const [confirmInfo, setConfirmInfo] = useState({
        text: '',
        onAccept: () => { },
        onReject: () => { }
    });

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities);
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const registerUser = async (user) => {
        try {
            if (user.isMaster) {
                await MasterService.addMaster(user);
            } else {
                await ClientService.addClient(user);
            }
            setMessage({ show: true, color: 'green', message: 'Аккаунт успешно создан!' });
            setIsAuthorizationModalOpened(false);
        } catch (error) {
            setMessage({ show: true, color: 'red', message: 'Произошла ошибка!' });
            console.log(error);
        }
    }
    const loginUser = async (loginInfo) => {
        try {
            const loginResponse = await AuthService.auth(loginInfo);
            if (loginResponse.token) {
                localStorage.setItem('token', loginResponse.token);
                if (needRedirect) {
                    setRedirect({ path: jwtPayload(loginResponse.token).role, isRedirect: true });
                }
                setIsAuthorizationModalOpened(false);
            } else {
                setMessage({ show: true, color: 'red', message: 'Произошла ошибка!' });
                if (loginResponse?.response?.data?.name === "User don't have a password") {
                    setIsConfirmOpened(true);
                    setConfirmInfo({
                        text: 'У Вас отсутствует пароль для входа. Желаете получить его на свою почту?',
                        onAccept: async () => {
                            if (loginResponse.response.data.role === 'client') {
                                const client = await ClientService.checkClientByEmail(loginInfo.email);
                                await ClientService.resetClientPasswordById(client.id);
                                setIsConfirmOpened(false);
                                setMessage({ show: true, color: 'green', message: 'Пароль успешно отправлен!' });
                            }
                            if (loginResponse.response.data.role === 'master') {
                                const master = await MasterService.checkMasterByEmail(loginInfo.email);
                                await MasterService.resetMasterPasswordById(master.id);
                            }
                        },
                        onReject: () => setIsConfirmOpened(false)
                    });
                }
            }
        } catch (error) {
            setMessage({ show: true, color: 'red', message: 'Произошла ошибка!' });
            console.log(error);
        }
    }

    return (
        redirect.isRedirect ?
            <Navigate push to={`/${redirect.path}/main`} />
            :
            <div>
                {isConfirmOpened && <Confirm text={confirmInfo.text} onAccept={confirmInfo.onAccept} onReject={confirmInfo.onReject} />}
                {isRegistration
                    ? <RegistrationForm user={defaultUser} onClick={registerUser} cities={cities} btnTitle={'Регистрация'} isRegistration={isRegistration} ></RegistrationForm>
                    : <LoginForm user={defaultUser} onClick={loginUser} cities={cities} btnTitle={'Вход'} isRegistration={isRegistration} ></LoginForm>
                }
            </div>
    )
}
