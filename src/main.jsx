// Import React's StrictMode for development checks
import { StrictMode } from "react";

// Import ReactDOM so React can render the application
import { createRoot } from "react-dom/client";

// Import Redux Provider so components can access the Redux store
import { Provider } from "react-redux";

// Import Bootstrap's CSS
import "bootstrap/dist/css/bootstrap.min.css";

// Import our custom Sass stylesheet
import "./styles/main.scss";

// Import the main StudyHub application
import App from "./App.jsx";

// Import the Redux store
import { store } from "./store/store.js";

// Find the HTML element where React will be mounted
createRoot(document.getElementById("root")).render(
    <StrictMode>

        {/* Make the Redux store available to the entire application */}
        <Provider store={store}>

            {/* Render the StudyHub application */}
            <App />

        </Provider>

    </StrictMode>
);