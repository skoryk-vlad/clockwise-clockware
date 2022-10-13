import { createSlice } from '@reduxjs/toolkit';
import { getOrdersMinAndMaxPricesThunk, getOrdersThunk } from './thunks';

const initialState = {
    orders: [],
    isLoading: false,
    error: null,
    pagination: {
        page: 1,
        limit: 10
    },
    filters: {
        masters: [],
        clients: [],
        cities: [],
        statuses: [],
        dateStart: '',
        dateEnd: '',
        priceRange: [50, 300]
    },
    sortByField: {
        sortedField: 'date',
        isDirectedASC: false
    },
    totalPages: 0,
    priceBoundaries: [0, 0],
    currentOrder: null,
    isModalOpened: false,
    imageUrls: []
}

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setPagination: (state, action) => {
            state.pagination = action.payload;
        },
        setSortByField: (state, action) => {
            state.sortByField = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = action.payload;
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        setIsModalOpened: (state, action) => {
            state.isModalOpened = action.payload;
        },
        setImageUrls: (state, action) => {
            state.imageUrls = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOrdersThunk.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getOrdersThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.orders = action.payload.rows;
            state.totalPages = Math.ceil(action.payload.count / state.pagination.limit);
        })
        builder.addCase(getOrdersThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
            state.orders = [];
            state.totalPages = 0;
        })

        builder.addCase(getOrdersMinAndMaxPricesThunk.fulfilled, (state, action) => {
            state.priceBoundaries = [action.payload.min, action.payload.max];
            state.error = null;
        })
        builder.addCase(getOrdersMinAndMaxPricesThunk.rejected, (state, action) => {
            state.error = action.error.message;
        })
    }
});

const { actions, reducer } = ordersSlice;

export const {
    setPagination,
    setSortByField,
    setFilters,
    setCurrentOrder,
    setIsModalOpened,
    setImageUrls
} = actions;

export default reducer;
