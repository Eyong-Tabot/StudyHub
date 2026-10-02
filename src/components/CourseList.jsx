// Import React's effect hook.
import { useEffect, useState } from "react";

// Import Redux hooks and the course action.
import { useDispatch, useSelector } from "react-redux";
import { setCourses } from "../features/courses/coursesSlice";

// Import the backend URL.
import { API_URL } from "../config";

// Course list component.
function CourseList() {
    // Get the Redux dispatch function.
    const dispatch = useDispatch();

    // Read courses from shared Redux state.
    const courses = useSelector(function (state) {
        return state.courses;
    });

    // Store a user-friendly error message.
    const [error, setError] = useState("");

    // Load courses once when the component mounts.
    useEffect(function () {
        async function loadCourses() {
            try {
                // Request course data from Express.
                const response = await fetch(
                    `${API_URL}/api/courses`
                );

                // Convert unsuccessful HTTP responses into errors.
                if (!response.ok) {
                    throw new Error("Failed to load courses");
                }

                // Parse the JSON response.
                const data = await response.json();

                // Store the server data in Redux.
                dispatch(setCourses(data));
            } catch {
                // Show a safe message without exposing implementation details.
                setError("Unable to load courses.");
            }
        }

        loadCourses();
    }, [dispatch]);

    return (
        <section id="courses" className="container my-5">
            <h2 className="mb-4">My Courses</h2>

            {/* Display API errors. */}
            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="row g-4">
                {/* Render one card for each course. */}
                {courses.map(function (course) {
                    return (
                        <div
                            key={course.id}
                            className="col-md-6 col-lg-3"
                        >
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {course.name}
                                    </h5>

                                    <p className="card-text">
                                        {course.level}
                                    </p>

                                    <div className="progress">
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: `${course.progress}%`
                                            }}
                                            aria-valuenow={course.progress}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {course.progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// Export CourseList.
export default CourseList;
