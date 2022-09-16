import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthService, CityService, ClientService, MasterService } from '../API/Server';
import { CLIENT_STATUSES } from '../constants.ts';
import { useFetching } from '../hooks/useFetching';
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

export const AuthorizationModal = ({ isRegistration }) => {
    const [redirect, setRedirect] = useState({ isRedirect: false, path: '' });

    const [cities, setCities] = useState([]);
    const [fetchCities, isCitiesLoading, Error] = useFetching(async () => {
        const cities = await CityService.getCities();
        setCities(cities);
    });
    useEffect(() => {
        fetchCities();
    }, []);

    const registerUser = async (user) => {
        await ClientService.addClient(user);
        // try {
        //     if (user.isMaster) {
        //         await MasterService.addMaster(user);
        //     } else {
        //         await ClientService.addClient(user);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    }
    const loginUser = async (loginInfo) => {
        try {
            const loginResponse = await AuthService.auth(loginInfo);
            if (loginResponse.token) {
                localStorage.setItem('token', loginResponse.token);
                setRedirect({ path: jwtPayload(loginResponse.token).role, isRedirect: true });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        redirect.isRedirect ?
            <Navigate push to={`/${redirect.path}/main`} />
            :
            <div>
                {isRegistration
                    ? <RegistrationForm user={defaultUser} onClick={registerUser} cities={cities} btnTitle={'Регистрация'} isRegistration={isRegistration} ></RegistrationForm>
                    : <LoginForm user={defaultUser} onClick={loginUser} cities={cities} btnTitle={'Вход'} isRegistration={isRegistration} ></LoginForm>
                }
            </div>
    )
}
