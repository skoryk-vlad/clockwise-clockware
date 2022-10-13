import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { Notifications } from './components/Notifications';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import './styles/App.css';
import './styles/reset.css';
import { Provider } from 'react-redux';
import store from './store/store';

const PayPalOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    "currency": "USD",
    "components": "buttons"
};

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <PayPalScriptProvider options={PayPalOptions} >
                    <AppRouter />
                    <Notifications />
                </PayPalScriptProvider>
            </BrowserRouter>
        </Provider>
    )
}

export default App;
