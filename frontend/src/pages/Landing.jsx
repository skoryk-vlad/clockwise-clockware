import React, { useContext, useState } from 'react'
import { MyModal } from '../components/modal/MyModal'
import { OrderForm } from '../components/OrderForm'
import { BlueButton } from '../components/BlueButton/BlueButton'
import '../styles/App.css';
import '../styles/reset.css';

export const Landing = () => {
    const [modal, setModal] = useState(false);

    return (
        <div className="wrapper">
            <BlueButton onClick={() => setModal(true)}>
                Заказать услугу
            </BlueButton>
            <MyModal visible={modal} setVisible={setModal}>
                <OrderForm />
            </MyModal>
        </div>
    );
}