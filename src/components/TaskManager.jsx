// Import React hooks.
import { useEffect, useState } from "react";

// Import Redux hooks and task actions.
import { useDispatch, useSelector } from "react-redux";
import {
    addTask,
    deleteTask,
    setTasks,
    updateTask
} from "../features/tasks/tasksSlice";

// Import the backend URL.
import { API_URL } from "../config";

// Task management component.
function TaskManager() {
    // Get the Redux dispatch function.
    const dispatch = useDispatch();

    // Read tasks from shared state.
    const tasks = useSelector(function (state) {
        return state.tasks;
    });

    // Read authentication state.
    const loggedIn = useSelector(function (state) {
        return state.user.loggedIn;
    });

    // Store the current input value.
    const [taskText, setTaskText] = useState("");

    // Store a user-friendly error.
    const [error, setError] = useState("");

    // Load tasks after authentication becomes available.
    useEffect(function () {
        async function loadTasks() {
            // Guests cannot access protected tasks.
            if (!loggedIn) {
                dispatch(setTasks([]));
                return;
            }

            try {
                // Request tasks with cookies included.
                const response = await fetch(
                    `${API_URL}/api/tasks`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error("Failed to load tasks");
                }

                // Store server data in Redux.
                const data = await response.json();
                dispatch(setTasks(data));
            } catch {
                setError("Unable to load your tasks.");
            }
        }

        loadTasks();
    }, [dispatch, loggedIn]);

    // Add a task through the backend.
    async function handleAddTask() {
        if (!loggedIn) {
            setError("Please register or log in before creating tasks.");
            return;
        }

        if (taskText.trim() === "") {
            setError("Please enter a task.");
            return;
        }

        setError("");

        try {
            // Send the new task to Express.
            const response = await fetch(
                `${API_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        text: taskText
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to add task");
            }

            // Add the server-created task to Redux.
            dispatch(addTask(data));
            setTaskText("");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    // Toggle a task's completion state.
    async function handleToggleTask(task) {
        setError("");

        try {
            // Send the new completion state to the API.
            const response = await fetch(
                `${API_URL}/api/tasks/${task.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        completed: !task.completed
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update task");
            }

            // Replace the task with the server's version.
            dispatch(updateTask(data));
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    // Delete a task through the backend.
    async function handleDeleteTask(id) {
        setError("");

        try {
            // Ask Express to delete the task.
            const response = await fetch(
                `${API_URL}/api/tasks/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to delete task");
            }

            // Remove the task from Redux after deletion succeeds.
            dispatch(deleteTask(id));
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    return (
        <section id="tasks" className="container my-5">
            <h2 className="mb-4">My Tasks</h2>

            {/* Explain why protected tasks are unavailable to guests. */}
            {!loggedIn && (
                <div className="alert alert-info">
                    Register or log in to create and manage personal tasks.
                </div>
            )}

            {/* Display API errors. */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="input-group mb-4">
                <input
                    type="text"
                    className="form-control"
                    value={taskText}
                    onChange={function (event) {
                        setTaskText(event.target.value);
                    }}
                    onKeyDown={function (event) {
                        if (event.key === "Enter") {
                            handleAddTask();
                        }
                    }}
                    placeholder="Enter a task"
                    disabled={!loggedIn}
                    maxLength="255"
                />

                <button
                    className="btn btn-primary"
                    onClick={handleAddTask}
                    disabled={!loggedIn}
                >
                    Add Task
                </button>
            </div>

            <div className="list-group">
                {tasks.map(function (task) {
                    return (
                        <div
                            key={task.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span
                                className={
                                    task.completed
                                        ? "text-decoration-line-through text-muted"
                                        : ""
                                }
                            >
                                {task.text}
                            </span>

                            <div>
                                <button
                                    className="btn btn-success btn-sm me-2"
                                    onClick={function () {
                                        handleToggleTask(task);
                                    }}
                                >
                                    {task.completed ? "Undo" : "Complete"}
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={function () {
                                        handleDeleteTask(task.id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// Export TaskManager.
export default TaskManager;
