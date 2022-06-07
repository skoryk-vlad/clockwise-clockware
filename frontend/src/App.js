import React, { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import { AuthContext } from './context/context';
import './styles/App.css';
import './styles/reset.css';

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if(localStorage.getItem('auth')) {
            setIsAuth(true);
        }
        setIsLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{
            isAuth,
            setIsAuth,
            isLoading
        }}>
            <BrowserRouter>
                <AppRouter/>
            </BrowserRouter>
        </AuthContext.Provider>
        
    )
}

export default App;
