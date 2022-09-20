import React, { useEffect, useState } from 'react'
import { MyModal } from '../components/modal/MyModal'
import '../styles/App.css';
import { Header } from '../components/Landing/Header/Header';
import { Main } from '../components/Landing/Main/Main';
import { Footer } from '../components/Landing/Footer/Footer';
import { TopButton } from '../components/Landing/TopButton/TopButton';
import { OrderModal } from '../components/OrderModal';
import { AuthorizationModal } from '../components/AuthorizationModal';

export const Landing = () => {
    const [isOrderModalOpened, setIsOrderModalOpened] = useState(false);
    const [isAuthorizationModalOpened, setIsAuthorizationModalOpened] = useState(false);
    const [isRegistration, setIsRegistration] = useState(true);
    const [needRedirect, setNeedRedirect] = useState(true);

    useEffect(() => {
        document.title = "Ремонт напольных часов - Clockwise Clockware";
    }, []);

    return (
        <div className="wrapper">
            <Header register={() => { setIsAuthorizationModalOpened(true); setIsRegistration(true) }}
                login={() => { setIsAuthorizationModalOpened(true); setIsRegistration(false) }} />
            <Main onClick={() => setIsOrderModalOpened(true)} />
            <Footer />
            <TopButton />
            
            <MyModal visible={isOrderModalOpened} setVisible={setIsOrderModalOpened}>
                <OrderModal setIsOrderModalOpened={setIsOrderModalOpened}
                    login={() => { setIsAuthorizationModalOpened(true); setIsRegistration(false); setNeedRedirect(false) }}
                    register={() => { setIsAuthorizationModalOpened(true); setIsRegistration(true) }} />
            </MyModal>

            <MyModal visible={isAuthorizationModalOpened} setVisible={setIsAuthorizationModalOpened}>
                <AuthorizationModal isRegistration={isRegistration} needRedirect={needRedirect} setIsAuthorizationModalOpened={setIsAuthorizationModalOpened} />
            </MyModal>
        </div>
    );
}
