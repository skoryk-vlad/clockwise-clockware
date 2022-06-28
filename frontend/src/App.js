import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import { BrowserRouter } from 'react-router-dom';
import Server from './API/Server';
import { AppRouter } from './components/AppRouter';
import { AuthContext } from './context/context';
import './styles/App.css';
import './styles/reset.css';

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        async function fetchData() {
            if(localStorage.getItem('token')) {
                const c = await Server.checkAuth(localStorage.getItem('token'));
                setIsAuth(c.auth);
            } else {
                setIsAuth(false);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            isLoading
        }}>
            {/* <Helmet>
                <title>Clockwise Clockware</title>
            </Helmet> */}
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </AuthContext.Provider>
    )
}

export default App;
