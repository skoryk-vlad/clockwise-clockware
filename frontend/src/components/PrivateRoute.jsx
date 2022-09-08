import React from 'react'
import { Navigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import { isAfter } from 'date-fns';

const IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const jwtPayload = (token) => {
    if (!token.split('.')[1]) return false;
    const payloadJSON = Buffer.from(token.split('.')[1], 'base64').toString();
    if (IsJsonString(payloadJSON)) {
        return JSON.parse(payloadJSON);
    }
    return false;
};

const isJWTExpired = (token) => {
    const payload = jwtPayload(token);
    if (!payload || isAfter(new Date(), new Date(payload.exp * 1000))) {
        localStorage.removeItem('token');
        return true
    };
    return false;
};

export const PrivateRoute = ({ children }) => {
    return (
            localStorage.getItem('token') && !isJWTExpired(localStorage.getItem('token'))
            ?
            children
            :
            <Navigate push to="/admin/login" />
    )
}
