// Import Redux's selector hook.
import { useSelector } from "react-redux";

// Dashboard component.
function Dashboard() {
    // Read shared user state.
    const user = useSelector(function (state) {
        return state.user;
    });

    // Read shared task state.
    const tasks = useSelector(function (state) {
        return state.tasks;
    });

    // Read shared course state.
    const courses = useSelector(function (state) {
        return state.courses;
    });

    return (
        <section id="dashboard" className="container my-5">
            {/* Show the current user's name. */}
            <h2 className="mb-4">
                Welcome, {user.name}
            </h2>

            <div className="row g-3">
                {/* Course summary. */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Courses</h5>
                            <p className="card-text">
                                {courses.length} courses
                            </p>
                        </div>
                    </div>
                </div>

                {/* Task summary. */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Tasks</h5>
                            <p className="card-text">
                                {tasks.length} tasks
                            </p>
                        </div>
                    </div>
                </div>

                {/* Authentication summary. */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Account</h5>
                            <p className="card-text">
                                {user.loggedIn ? "Logged in" : "Guest"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Export Dashboard.
export default Dashboard;
