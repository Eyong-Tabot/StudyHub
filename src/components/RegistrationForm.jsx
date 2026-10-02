// Import React's state hook.
import { useState } from "react";

// Import Redux hooks and user actions.
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "../features/user/userSlice";

// Import the backend URL.
import { API_URL } from "../config";

// Authentication form component.
function RegistrationForm() {
    // Get Redux dispatch.
    const dispatch = useDispatch();

    // Read current authentication state.
    const user = useSelector(function (state) {
        return state.user;
    });

    // Switch between registration and login modes.
    const [mode, setMode] = useState("register");

    // Store form values.
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Store status messages.
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Submit either a registration or login request.
    async function handleSubmit(event) {
        // Prevent a full-page browser reload.
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            // Select the matching authentication endpoint.
            const endpoint = mode === "register"
                ? "/api/auth/register"
                : "/api/auth/login";

            // Build the request body for the selected mode.
            const body = mode === "register"
                ? { name, email, password }
                : { email, password };

            // Send credentials to the backend.
            const response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify(body)
                }
            );

            // Read the JSON response.
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Authentication request failed"
                );
            }

            // Store the safe user object in Redux.
            dispatch(setUser(data.user));

            // Show success feedback.
            setMessage(data.message);

            // Clear sensitive form data.
            setName("");
            setEmail("");
            setPassword("");
        } catch (requestError) {
            // Display a safe error message.
            setError(requestError.message);
        }
    }

    // Log out through the backend.
    async function handleLogout() {
        setMessage("");
        setError("");

        try {
            // Ask the server to clear the authentication cookie.
            const response = await fetch(
                `${API_URL}/api/auth/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            // Clear the local Redux user state.
            dispatch(logout());
            setMessage("Logout successful");
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    // Show the logged-in account controls.
    if (user.loggedIn) {
        return (
            <section
                id="registration"
                className="container my-5"
            >
                <div className="card">
                    <div className="card-body">
                        <h2 className="mb-3">Account</h2>
                        <p className="mb-1">
                            Signed in as <strong>{user.name}</strong>
                        </p>
                        <p className="text-muted">
                            {user.email}
                        </p>

                        {message && (
                            <div className="alert alert-success">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        )}

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            id="registration"
            className="container my-5"
        >
            <h2 className="mb-4">
                {mode === "register" ? "Create an Account" : "Log In"}
            </h2>

            {/* Allow the user to switch authentication modes. */}
            <div className="btn-group mb-4" role="group">
                <button
                    type="button"
                    className={
                        mode === "register"
                            ? "btn btn-primary"
                            : "btn btn-outline-primary"
                    }
                    onClick={function () {
                        setMode("register");
                        setError("");
                        setMessage("");
                    }}
                >
                    Register
                </button>

                <button
                    type="button"
                    className={
                        mode === "login"
                            ? "btn btn-primary"
                            : "btn btn-outline-primary"
                    }
                    onClick={function () {
                        setMode("login");
                        setError("");
                        setMessage("");
                    }}
                >
                    Log In
                </button>
            </div>

            {message && (
                <div className="alert alert-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Registration needs a name; login does not. */}
                {mode === "register" && (
                    <div className="mb-3">
                        <label
                            htmlFor="name"
                            className="form-label"
                        >
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={function (event) {
                                setName(event.target.value);
                            }}
                            minLength="2"
                            maxLength="100"
                            required
                        />
                    </div>
                )}

                {/* Email field. */}
                <div className="mb-3">
                    <label
                        htmlFor="email"
                        className="form-label"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={function (event) {
                            setEmail(event.target.value);
                        }}
                        maxLength="255"
                        required
                    />
                </div>

                {/* Password field. */}
                <div className="mb-3">
                    <label
                        htmlFor="password"
                        className="form-label"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={function (event) {
                            setPassword(event.target.value);
                        }}
                        minLength="8"
                        required
                    />

                    {mode === "register" && (
                        <div className="form-text">
                            Use at least 8 characters.
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {mode === "register" ? "Register" : "Log In"}
                </button>
            </form>
        </section>
    );
}

// Export RegistrationForm.
export default RegistrationForm;
