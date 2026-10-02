// Import Redux Toolkit's store creator
import { configureStore } from "@reduxjs/toolkit";

// Import the user reducer
import userReducer from "../features/user/userSlice";

// Import the tasks reducer
import tasksReducer from "../features/tasks/tasksSlice";

// Import the courses reducer
import coursesReducer from "../features/courses/coursesSlice";

// Create the central Redux store
export const store = configureStore({

    // Combine all application state into separate sections
    reducer: {
        user: userReducer,
        tasks: tasksReducer,
        courses: coursesReducer
    }
});