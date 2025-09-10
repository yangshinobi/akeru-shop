import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_DETAILS_URL } from "../constants";

export const fetchUserDetails = createAsyncThunk(
    'user/fetchUserDetails',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await fetch(USER_DETAILS_URL);
            if (!response.ok) throw new Error('Failed to fetch user details');
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);