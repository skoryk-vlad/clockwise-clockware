import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from './thunks';

const initialState = {
    role: '',
    id: null,
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetAuth: (state) => {
            state.role = initialState.role;
            state.id = initialState.id;
            state.error = initialState.error;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunk.pending, (state) => {
            state.error = null;
        })
        builder.addCase(loginThunk.fulfilled, (state, action) => {
            state.error = null;
            state.role = action.payload.role;
            state.id = action.payload.id;
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            state.error = action.payload;
        })
    }
});

const { actions, reducer } = authSlice;

export const {
    resetAuth
} = actions;

export default reducer;
