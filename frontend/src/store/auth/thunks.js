import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../API/Server";
import { jwtPayload } from "../../components/PrivateRoute";

export const loginThunk = createAsyncThunk(
    'auth/loginThunk',
    async (loginInfo, { rejectWithValue }) => {
        try {
            const loginResponse = await AuthService.auth(loginInfo);

            if(!loginResponse.token) {
                throw new Error(loginResponse.response.data)
            }

            localStorage.setItem('token', loginResponse.token);
            return jwtPayload(loginResponse.token);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
