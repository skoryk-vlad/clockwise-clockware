import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../constants';
import { publicRoutes, adminRoutes, clientRoutes, masterRoutes } from '../router/routes';
import { PrivateRoute } from './PrivateRoute';

export const AppRouter = () => {
    return (
        <Routes>
            <>
                {publicRoutes.map(route =>
                    <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
                )}
                <Route path="*" element={<Navigate replace to="/" />} />
            </>
            <>
                {adminRoutes.map(route =>
                    <Route path={route.path} element={<PrivateRoute role={ROLES.ADMIN}>{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
                )}
                <Route path={`/admin/*`} element={<PrivateRoute role={ROLES.ADMIN}><Navigate replace to={`/admin/main`} /></PrivateRoute>} />
            </>
            <>
                {clientRoutes.map(route =>
                    <Route path={route.path} element={<PrivateRoute role={ROLES.CLIENT}>{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
                )}
                <Route path={`/client/*`} element={<PrivateRoute role={ROLES.CLIENT}><Navigate replace to={`/client/main`} /></PrivateRoute>} />
            </>
            <>
                {masterRoutes.map(route =>
                    <Route path={route.path} element={<PrivateRoute role={ROLES.MASTER}>{route.element}</PrivateRoute>} exact={route.exact} key={route.path} />
                )}
                <Route path={`/master/*`} element={<PrivateRoute role={ROLES.MASTER}><Navigate replace to={`/master/main`} /></PrivateRoute>} />
            </>
        </Routes>
    )
}
