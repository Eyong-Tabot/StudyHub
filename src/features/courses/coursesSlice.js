// Import Redux Toolkit's createSlice function.
import { createSlice } from "@reduxjs/toolkit";

// Store courses loaded from the backend.
const coursesSlice = createSlice({
    name: "courses",

    // Start empty because PostgreSQL is the source of truth.
    initialState: [],

    reducers: {
        // Replace the course list after loading it from the API.
        setCourses: function (state, action) {
            return action.payload;
        }
    }
});

// Export course actions.
export const { setCourses } = coursesSlice.actions;

// Export the reducer.
export default coursesSlice.reducer;
