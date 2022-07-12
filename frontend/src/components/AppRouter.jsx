import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from '../router/routes';

export const AppRouter = () => {

    return (
        <Routes>
            {[...privateRoutes, ...publicRoutes].map(route =>
                <Route path={route.path} element={route.element} exact={route.exact} key={route.path} />
            )}
            <Route path="*" element={<Navigate replace to="/" />} />
            <Route path="/admin/*" element={<Navigate replace to="/admin/main" />} />
        </Routes>
    )
}
