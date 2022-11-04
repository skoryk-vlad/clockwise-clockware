import React from 'react';
import classes from './FacebookLogin.module.css';

export const FacebookLogin = ({ onSuccess, onError }) => {
    const login = async () => {
        try {
            const currentStatus = await new Promise(window.FB.getLoginStatus);
            if (currentStatus?.authResponse?.accessToken) return onSuccess({ token: currentStatus.authResponse.accessToken, service: 'facebook' });

            const { authResponse } = await new Promise((resolve, reject) => {
                window.FB.login(response => resolve(response), {
                    scope: 'email',
                    return_scopes: true
                });
            });
            if (authResponse) onSuccess({ token: authResponse.accessToken, service: 'facebook' });
        } catch (error) {
            onError(error);
        }
    };

    return (
        <div className={classes.facebook} onClick={login}>
            <img src="/images/facebook.png" alt="Facebook" />
        </div>
    )
}

