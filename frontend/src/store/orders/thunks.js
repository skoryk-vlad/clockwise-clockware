import { createAsyncThunk } from "@reduxjs/toolkit";
import { OrderService } from "../../API/Server";
import { setIsModalOpened } from "./slice";

export const getOrdersThunk = createAsyncThunk(
    'orders/getOrdersThunk',
    async (_, { rejectWithValue, getState }) => {
        try {
            const orders = await OrderService.getOrders({ ...getState().orders.pagination, ...getState().orders.sortByField, ...getState().orders.filters });
            return orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getOrdersMinAndMaxPricesThunk = createAsyncThunk(
    'orders/getOrdersMinAndMaxPricesThunk',
    async (_, { rejectWithValue }) => {
        try {
            const prices = await OrderService.getMinAndMaxPrices();
            return prices;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateOrderThunk = createAsyncThunk(
    'orders/updateOrderThunk',
    async (order, { rejectWithValue, dispatch }) => {
        try {
            const orderReturned = await OrderService.updateOrderById(order);
            dispatch(setIsModalOpened(false));
            dispatch(getOrdersThunk());
            return orderReturned;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteOrderThunk = createAsyncThunk(
    'orders/deleteOrderThunk',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const order = await OrderService.deleteOrderById(id);
            dispatch(getOrdersThunk());
            return order;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const addOrderThunk = createAsyncThunk(
    'orders/addOrderThunk',
    async (newOrder, { rejectWithValue, dispatch }) => {
        try {
            const order = await OrderService.addOrder(newOrder);
            dispatch(setIsModalOpened(false));
            dispatch(getOrdersThunk());
            return order;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
