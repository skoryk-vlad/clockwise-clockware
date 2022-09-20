import React from 'react';
import { NavLink } from 'react-router-dom';
import { OrderButton } from '../components/OrderButton/OrderButton';

export const MessageFromEmail = ({ children }) => {
    return (
        <div className='messageFromEmailWrapper'>
            <div className='messageFromEmail'>
                <p>{children}</p>
                <NavLink to="/"><OrderButton>На главную</OrderButton></NavLink>
            </div>
        </div>
    )
}
