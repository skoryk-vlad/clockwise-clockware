import React, { useEffect, useState } from 'react'
import { MyModal } from '../components/modal/MyModal'
import '../styles/App.css';
import { Header } from '../components/Landing/Header/Header';
import { Main } from '../components/Landing/Main/Main';
import { Footer } from '../components/Landing/Footer/Footer';
import { TopButton } from '../components/Landing/TopButton/TopButton';
import { OrderModal } from '../components/OrderModal';
import { AuthorizationModal } from '../components/AuthorizationModal';
import { Message } from '../components/Message/Message';

export const Landing = () => {
    const [isOrderModalOpened, setIsOrderModalOpened] = useState(false);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [isAuthorizationModalOpened, setIsAuthorizationModalOpened] = useState(false);
    const [isRegistration, setIsRegistration] = useState(true);
    const [confirmModalText, setConfirmModalText] = useState(false);
    const [message, setMessage] = useState({show: false, color: 'green', message: ''});

    useEffect(() => {
        document.title = "Ремонт напольных часов - Clockwise Clockware";

        if (document.location.search) {
            const state = document.location.search.slice(1, document.location.search.length);
            if (state === 'success') {
                setConfirmModalText('Подтверждение прошло успешно!');
                setIsConfirmModalOpened(true);
            } else if (state === 'error') {
                setConfirmModalText('Произошла ошибка!');
                setIsConfirmModalOpened(true);
            } else if (state === 'confirmed') {
                setConfirmModalText('Подтверждение уже было произведено!');
                setIsConfirmModalOpened(true);
            }
        }
    }, []);

    return (
        <div className="wrapper">
            <Header register={() => { setIsAuthorizationModalOpened(true); setIsRegistration(true) }}
                login={() => { setIsAuthorizationModalOpened(true); setIsRegistration(false) }} />
            <Main onClick={() => setIsOrderModalOpened(true)} />
            <Footer />
            <TopButton />

            <MyModal visible={isOrderModalOpened} setVisible={setIsOrderModalOpened}>
                <OrderModal setMessage={setMessage} setIsOrderModalOpened={setIsOrderModalOpened} />
            </MyModal>
            {message.show && <Message setMessage={setMessage} message={message} />}

            <MyModal visible={isConfirmModalOpened} setVisible={setIsConfirmModalOpened}>
                <div className='modalMessage'>{confirmModalText}</div>
            </MyModal>

            <MyModal visible={isAuthorizationModalOpened} setVisible={setIsAuthorizationModalOpened}>
                <AuthorizationModal isRegistration={isRegistration} />
            </MyModal>
        </div>
    );
}