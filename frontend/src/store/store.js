import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ordersReducer from './orders/slice';
import authSlice from './auth/slice';

const rootReducer = combineReducers({
    orders: ordersReducer,
    auth: authSlice
});

const store = configureStore({
    reducer: rootReducer
});

export default store;
