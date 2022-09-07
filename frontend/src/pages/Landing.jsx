import React, { useEffect, useState } from 'react'
import { MyModal } from '../components/modal/MyModal'
import '../styles/App.css';
import { Header } from '../components/Landing/Header/Header';
import { Main } from '../components/Landing/Main/Main';
import { Footer } from '../components/Landing/Footer/Footer';
import { TopButton } from '../components/Landing/TopButton/TopButton';
import { OrderModal } from '../components/OrderModal';

export const Landing = () => {
    const [isOrderModalOpened, setIsOrderModalOpened] = useState(false);
    const [isConfirmModalOpened, setIsConfirmModalOpened] = useState(false);
    const [confirmModalText, setConfirmModalText] = useState(false);

    useEffect(() => {
        document.title = "Ремонт напольных часов - Clockwise Clockware";

        if(document.location.search) {
            const state = document.location.search.slice(1, document.location.search.length);
            if(state === 'success') {
                setConfirmModalText('Заказ успешно подтвержден!');
                setIsConfirmModalOpened(true);
            } else if(state === 'error') {
                setConfirmModalText('Произошла ошибка!');
                setIsConfirmModalOpened(true);
            } else if(state === 'expired') {
                setConfirmModalText('Истек срок подтверждения заказа!');
                setIsConfirmModalOpened(true);
            } else if(state === 'confirmed') {
                setConfirmModalText('Заказ уже был подтвержден!');
                setIsConfirmModalOpened(true);
            }
        }
    }, []);

    return (
        <div className="wrapper">
            <Header onClick={() => setIsOrderModalOpened(true)} />
            <Main onClick={() => setIsOrderModalOpened(true)} />
            <Footer />
            <TopButton />
            
            <MyModal visible={isOrderModalOpened} setVisible={setIsOrderModalOpened}>
                <OrderModal/>
            </MyModal>

            <MyModal visible={isConfirmModalOpened} setVisible={setIsConfirmModalOpened}>
                <div className='modalMessage'>{confirmModalText}</div>
            </MyModal>
        </div>
    );
}