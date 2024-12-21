import { createSlice } from "@reduxjs/toolkit"; 

const initialState = {
    user: {},
    accessToken: "",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken, } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.newAccessToken;
        },
        logout: (state) => {
            state.user = {};
            state.accessToken = "";
        },
    },
});
export const { setCredentials,setAccessToken, logout } = userSlice.actions;
export default userSlice.reducer;