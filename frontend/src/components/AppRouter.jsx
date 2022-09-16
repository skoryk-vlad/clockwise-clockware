import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { publicRoutes, adminRoutes, clientRoutes, masterRoutes } from '../router/routes';
import { jwtPayload, PrivateRoute } from './PrivateRoute';

export const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(route =>
                <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
            )}
            {adminRoutes.map(route =>
                <Route path={route.path} element={<PrivateRoute role="admin">{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
            )}
            {clientRoutes.map(route =>
                <Route path={route.path} element={<PrivateRoute role="client">{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
            )}
            {masterRoutes.map(route =>
                <Route path={route.path} element={<PrivateRoute role="master">{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
            )}
            <Route path="*" element={<Navigate replace to="/" />} />
            {/* <Route path="/admin/*" element={<Navigate replace to="/admin/main" />} />
            <Route path="/client/*" element={<Navigate replace to="/client/main" />} />
            <Route path="/master/*" element={<Navigate replace to="/master/main" />} /> */}
            <Route path={`/${jwtPayload(localStorage.getItem('token')).role}/*`} element={<Navigate replace to={`/${jwtPayload(localStorage.getItem('token')).role}/main`} />} />
        </Routes>
    )
}
