// Import Redux Toolkit's createSlice function.
import { createSlice } from "@reduxjs/toolkit";

// Store the currently authenticated user's public information.
const userSlice = createSlice({
    name: "user",

    initialState: {
        id: null,
        name: "Student",
        email: "",
        role: "student",
        loggedIn: false
    },

    reducers: {
        // Save a user after registration or login.
        setUser: function (state, action) {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role || "student";
            state.loggedIn = true;
        },

        // Clear the user after logout.
        logout: function (state) {
            state.id = null;
            state.name = "Student";
            state.email = "";
            state.role = "student";
            state.loggedIn = false;
        }
    }
});

// Export user actions for components.
export const { setUser, logout } = userSlice.actions;

// Export the reducer for the Redux store.
export default userSlice.reducer;
