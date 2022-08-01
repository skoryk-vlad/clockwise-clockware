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
    const [modalConf, setModalConf] = useState(false);
    const [confText, setConfconfText] = useState(false);

    useEffect(() => {
        document.title = "Ремонт напольных часов - Clockwise Clockware";

        if(document.location.search) {
            const state = document.location.search.slice(1, document.location.search.length);
            if(state === 'success') {
                setConfconfText('Заказ успешно подтвержден!');
                setModalConf(true);
            } else if(state === 'error') {
                setConfconfText('Произошла ошибка!');
                setModalConf(true);
            }
        }
    }, []);

    return (
        <div className="wrapper">
            <Header onClick={() => setModal(true)} />
            <Main onClick={() => setModal(true)} />
            <Footer />
            <TopButton />
            
            <MyModal visible={modal} setVisible={setModal}>
                <OrderForm />
            </MyModal>

            <MyModal visible={modalConf} setVisible={setModalConf}>
                <div className='modalMessage'>{confText}</div>
            </MyModal>
        </div>
    );
}