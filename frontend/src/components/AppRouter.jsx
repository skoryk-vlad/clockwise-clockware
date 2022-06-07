import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext } from '../context/context';
import { publicRoutes, privateRoutes } from '../router/routes'
import { Loader } from './Loader/Loader';

export const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);

    if(isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><Loader /></div>
        );
    }

    // const isAuth = false;

    return (
        isAuth
            ?
            <Routes>
                {[...privateRoutes, ...publicRoutes].map(route =>
                    <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
                )}
                <Route path="*" element={<Navigate replace to="/admin" />} />
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route =>
                    <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
                )}
                <Route path="*" element={<Navigate replace to="/" />} />
                <Route path="/admin/*" element={<Navigate replace to="/admin/login" />} />
            </Routes>
    )
}
