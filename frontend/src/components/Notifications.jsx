import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const NOTIFY_TYPES =  {
    SUCCESS: 'success',
    ERROR: 'error'
}

export const notify = (type, message = 'Произошла ошибка!') => {
    switch (type) {
        case NOTIFY_TYPES.SUCCESS:
            toast.success(message, { autoClose: 10000 });
            break;
        case NOTIFY_TYPES.ERROR:
            toast.error(message);
            break;
        default:
            break;
    }
};


export const Notifications = () => {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    )
}
