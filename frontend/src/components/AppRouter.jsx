import React from 'react'
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../constants';
import { publicRoutes, adminRoutes, clientRoutes, masterRoutes } from '../router/routes';
import { LocaleRoute } from './LocaleRoute';
import { PrivateRoute } from './PrivateRoute';

export const AppRouter = () => {
    const { i18n } = useTranslation();

    return (
        <Routes>
            <>
                {publicRoutes.map(route =>
                    <React.Fragment key={route.path}>
                        <Route path={`/:locale${route.path}`} element={<LocaleRoute>{route.element}</LocaleRoute>} exact={route.exact} />
                        <Route path={route.path} element={<Navigate replace={true} to={`/${i18n.language}${route.path}`} />} />
                    </React.Fragment>
                )}
                <Route path="*" element={<Navigate replace={true} to={`/${i18n.language}`} />} />
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
