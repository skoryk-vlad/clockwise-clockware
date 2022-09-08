import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/AppRouter';
import './styles/App.css';
import './styles/reset.css';

const App = () => {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    )
}

export default App;
