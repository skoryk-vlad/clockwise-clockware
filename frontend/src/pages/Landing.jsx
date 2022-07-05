import React, { useEffect, useState } from 'react'
import { MyModal } from '../components/modal/MyModal'
import { OrderForm } from '../components/OrderForm'
import '../styles/App.css';
import { Header } from '../components/Landing/Header/Header';
import { Main } from '../components/Landing/Main/Main';
import { Footer } from '../components/Landing/Footer/Footer';
import { TopButton } from '../components/Landing/TopButton/TopButton';

export const Landing = () => {
    const [modal, setModal] = useState(false);

    useEffect(() => {
        document.title = "Ремонт напольных часов - Clockwise Clockware";
    }, []);

    return (
        <div className="wrapper">
            <Header onClick={() => setModal(true)} />
            <Main onClick={() => setModal(true)} />
            <Footer />
            <TopButton />
            
            <MyModal visible={modal} setVisible={setModal}>
                <OrderForm setModal={setModal} />
            </MyModal>
        </div>
    );
}