import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initFacebookSdk } from './services/initFacebookSdk';

initFacebookSdk();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
