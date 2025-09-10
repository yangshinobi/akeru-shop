import { createSlice} from '@reduxjs/toolkit';
import { fetchUserDetails } from '../../service/apiGetUserDetails';

const initialState = {
    userName: "",
    gender: "",
    email: "",
    address: "",
    error: "",
    status: 'idle' // Add status for loading state
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Regular reducers for synchronous updates
        updateUserDetails: (state, action) => {
            return { ...state, ...action.payload };
        },
        clearUserDetails: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
                state.error = '';
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userName = action.payload.userName;
                state.gender = action.payload.gender;
                state.email = action.payload.email;
                state.address = action.payload.address;
                state.error = '';
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || 'Failed to fetch user details';
            });
    }
});

export const { updateUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;