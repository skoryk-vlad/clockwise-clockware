import React from 'react'
import { Navigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import { isBefore } from 'date-fns';

const IsJsonString = (str) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const jwtPayload = (token) => {
    if (!token) return false;
    if (!token.split('.')[1]) return false;
    const payloadJSON = Buffer.from(token.split('.')[1], 'base64').toString();
    if (IsJsonString(payloadJSON)) {
        return JSON.parse(payloadJSON);
    }
    return false;
};

const checkJWT = (token, role) => {
    const payload = jwtPayload(token);
    if (payload && isBefore(new Date(), new Date(payload.exp * 1000))) {
        if (payload.role === role) {
            return true;
        }
    } else {
        localStorage.removeItem('token');
    }
    return false;
};

export const PrivateRoute = ({ children, role }) => {
    return (
        localStorage.getItem('token') && checkJWT(localStorage.getItem('token'), role)
            ?
            children
            :
            <Navigate push to="/" />
    )
}
