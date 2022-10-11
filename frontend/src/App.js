import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { Notifications } from './components/Notifications';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import './styles/App.css';
import './styles/reset.css';

const PayPalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    "currency": "USD",
    "components": "buttons"
};

const App = () => {
    return (
        <BrowserRouter>
            <PayPalScriptProvider options={PayPalOptions} >
                <AppRouter />
                <Notifications />
            </PayPalScriptProvider>
        </BrowserRouter>
    )
}

export default App;
