import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CityService, ClientService, MasterService, UserService } from '../API/Server';
import { CLIENT_STATUSES } from '../constants';
import { useFetching } from '../hooks/useFetching';
import { ConfirmationModal } from './ConfirmationModal/ConfirmationModal';
import { LoginForm } from './Forms/LoginForm';
import { RegistrationForm } from './Forms/RegistrationForm';
import { notify, NOTIFY_TYPES } from './Notifications';
import { useDispatch } from 'react-redux';
import { loginThunk } from '../store/auth/thunks';

const defaultUser = {
    name: '',
    email: '',
    password: '',
    isAgree: false,
    isMaster: false,
    cities: [],
    status: CLIENT_STATUSES.NOT_CONFIRMED
}

export const AuthorizationModal = ({ isRegistration, needRedirect = true, setIsAuthorizationModalOpened }) => {
    const dispatch = useDispatch();

    const [redirect, setRedirect] = useState({ isRedirect: false, path: '' });

    const [isConfirmationModalOpened, setIsConfirmationModalOpened] = useState(false);
    const [confirmationModalInfo, setConfirmationModalInfo] = useState({
        text: '',
        onAccept: () => { },
        onReject: () => { }
    });

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities.rows);
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
            notify(NOTIFY_TYPES.SUCCESS, 'Регистрация прошла успешно! Для авторизации необходимо подтвердить почту!');
            setIsAuthorizationModalOpened(false);
        } catch (error) {
            if (error.response.data === 'User with this email exist')
                notify(NOTIFY_TYPES.ERROR, 'Пользователь с таким электронным адресом уже существует!');
            else
                notify(NOTIFY_TYPES.ERROR);
            console.log(error.response.data);
        }
    }
    const loginUser = async (loginInfo) => {
        const response = await dispatch(loginThunk(loginInfo));

        if (!response.error) {
            if (needRedirect) {
                setRedirect({ path: response.payload.role, isRedirect: true });
            }
            setIsAuthorizationModalOpened(false);
        } else {
            if (response.payload === 'Email or password is incorrect')
                notify(NOTIFY_TYPES.ERROR, 'Электронный адрес или пароль введены неверно!');
            else if (response.payload === 'Master is not yet approved')
                notify(NOTIFY_TYPES.ERROR, 'Администратор еще Вас не одобрил!');
            else if (response.payload === "User doesn't have a password") {
                setIsConfirmationModalOpened(true);
                setConfirmationModalInfo({
                    text: 'У Вас отсутствует пароль для входа. Желаете получить его на свою почту?',
                    onAccept: async () => {
                        await UserService.createPassword(loginInfo.email);
                        setIsConfirmationModalOpened(false);
                        notify(NOTIFY_TYPES.SUCCESS, 'Пароль успешно отправлен!');
                    },
                    onReject: () => setIsConfirmationModalOpened(false)
                });
            }
            else
                notify(NOTIFY_TYPES.ERROR);
        }
    }

    return (
        redirect.isRedirect ?
            <Navigate push to={`/${redirect.path}/main`} />
            :
            <div>
                {isConfirmationModalOpened && <ConfirmationModal text={confirmationModalInfo.text} onAccept={confirmationModalInfo.onAccept} onReject={confirmationModalInfo.onReject} />}
                {isRegistration
                    ? <RegistrationForm user={defaultUser} onClick={registerUser} cities={cities} btnTitle={'Регистрация'} isRegistration={isRegistration} ></RegistrationForm>
                    : <LoginForm user={defaultUser} onClick={loginUser} cities={cities} btnTitle={'Вход'} isRegistration={isRegistration} ></LoginForm>
                }
            </div>
    )
}
