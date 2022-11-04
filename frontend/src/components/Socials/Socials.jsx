import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import { FacebookLogin } from './FacebookLogin/FacebookLogin';
import classes from './Socials.module.css';

export const Socials = ({ onSuccess, onError, title }) => {
  return (
    <div className={classes.socials__container}>
      <div className={classes.socials__title}>{title}</div>
      <div className={classes.socials}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={credentialResponse => onSuccess({ token: credentialResponse.credential, service: 'google' })}
            onError={onError}
            type="icon"
            shape="circle"
            text="signup_with"
          />
        </GoogleOAuthProvider>
        <FacebookLogin
          onSuccess={onSuccess}
          onError={onError}
        />
      </div>
    </div>
  )
}
