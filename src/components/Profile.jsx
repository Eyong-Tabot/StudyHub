// Import Redux's selector hook.
import { useSelector } from "react-redux";

// Profile component.
function Profile() {
    // Read user information from Redux.
    const user = useSelector(function (state) {
        return state.user;
    });

    return (
        <section id="profile" className="container my-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">
                        {user.name}
                    </h2>

                    <p className="card-text">
                        {user.email || "No email provided"}
                    </p>

                    <span className="badge bg-primary">
                        {user.loggedIn ? "Logged In" : "Guest"}
                    </span>
                </div>
            </div>
        </section>
    );
}

// Export Profile.
export default Profile;
