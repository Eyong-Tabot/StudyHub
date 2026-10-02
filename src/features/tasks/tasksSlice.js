// Import Redux Toolkit's createSlice function.
import { createSlice } from "@reduxjs/toolkit";

// Keep server-loaded tasks in shared Redux state.
const tasksSlice = createSlice({
    name: "tasks",

    // Start empty because PostgreSQL is now the source of truth.
    initialState: [],

    reducers: {
        // Replace all tasks after loading them from the API.
        setTasks: function (state, action) {
            return action.payload;
        },

        // Add a task returned by the API.
        addTask: function (state, action) {
            state.unshift(action.payload);
        },

        // Replace one task after an API update.
        updateTask: function (state, action) {
            return state.map(function (task) {
                return task.id === action.payload.id
                    ? action.payload
                    : task;
            });
        },

        // Remove a task after a successful API deletion.
        deleteTask: function (state, action) {
            return state.filter(function (task) {
                return task.id !== action.payload;
            });
        }
    }
});

// Export task actions.
export const {
    setTasks,
    addTask,
    updateTask,
    deleteTask
} = tasksSlice.actions;

// Export the reducer.
export default tasksSlice.reducer;
