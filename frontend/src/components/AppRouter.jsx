import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../router/routes';
import { RouterWrapper } from './RouterWrapper';

export const AppRouter = () => {
    return (
        <Routes>
            {publicRoutes.map(route =>
                <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
            )}
            {privateRoutes.map(route =>
                <Route path={route.path} element={<RouterWrapper>{route.element}</RouterWrapper>} exact={route.exact} key={route.path} />
            )}
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path="/admin/*" element={<Navigate replace to="/admin/main" />} />
        </Routes>
    )
}
