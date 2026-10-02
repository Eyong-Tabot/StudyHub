// Import React's effect hook.
import { useEffect } from "react";

// Import Redux dispatch.
import { useDispatch } from "react-redux";

// Import user action.
import { setUser, logout } from "./features/user/userSlice";

// Import API configuration.
import { API_URL } from "./config";

// Import StudyHub components.
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import CourseList from "./components/CourseList";
import TaskManager from "./components/TaskManager";
import QuizSection from "./components/QuizSection";
import Profile from "./components/Profile";
import RegistrationForm from "./components/RegistrationForm";

// Main StudyHub application.
function App() {
    // Get Redux dispatch.
    const dispatch = useDispatch();

    // Restore the current login state when the app starts.
    useEffect(function () {
        async function loadCurrentUser() {
            try {
                // Ask the backend whether the authentication cookie is valid.
                const response = await fetch(
                    `${API_URL}/api/auth/me`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    // A missing/expired cookie simply means the user is a guest.
                    dispatch(logout());
                    return;
                }

                // Store the authenticated user in Redux.
                const data = await response.json();
                dispatch(setUser(data.user));
            } catch {
                // Keep the application usable as a guest when the backend is offline.
                dispatch(logout());
            }
        }

        loadCurrentUser();
    }, [dispatch]);

    return (
        <>
            {/* Main navigation. */}
            <Navbar />

            {/* Dashboard. */}
            <Dashboard />

            {/* Courses. */}
            <CourseList />

            {/* Personal tasks. */}
            <TaskManager />

            {/* Quiz area. */}
            <QuizSection />

            {/* User profile. */}
            <Profile />

            {/* Registration and login. */}
            <RegistrationForm />

            {/* Application footer. */}
            <footer className="bg-dark text-white text-center py-4 mt-5">
                <p className="mb-0">
                    StudyHub © 2026
                </p>
            </footer>
        </>
    );
}

// Export the main application.
export default App;
