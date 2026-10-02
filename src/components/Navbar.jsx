// Import Redux's selector hook.
import { useSelector } from "react-redux";

// StudyHub navigation bar.
function Navbar() {
    // Read the current user's authentication state.
    const loggedIn = useSelector(function (state) {
        return state.user.loggedIn;
    });

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top">
            <div className="container">
                {/* StudyHub brand. */}
                <a className="navbar-brand" href="#dashboard">
                    StudyHub
                </a>

                {/* Navigation links. */}
                <div className="navbar-nav">
                    <a className="nav-link" href="#dashboard">
                        Dashboard
                    </a>
                    <a className="nav-link" href="#courses">
                        Courses
                    </a>
                    <a className="nav-link" href="#tasks">
                        Tasks
                    </a>
                    <a className="nav-link" href="#quizzes">
                        Quizzes
                    </a>
                    <a className="nav-link" href="#profile">
                        Profile
                    </a>
                </div>

                {/* Jump to the account section. */}
                <a
                    className="btn btn-primary"
                    href="#registration"
                >
                    {loggedIn ? "Account" : "Login"}
                </a>
            </div>
        </nav>
    );
}

// Export Navbar.
export default Navbar;
