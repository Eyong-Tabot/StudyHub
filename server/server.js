// Import Express.
const express = require("express");

// Import CORS.
const cors = require("cors");

// Import cookie-parser.
const cookieParser = require("cookie-parser");

// Import Helmet for secure HTTP headers.
const helmet = require("helmet");

// Import rate limiter.
const rateLimit = require("express-rate-limit");

// Import authentication routes.
const authRoutes = require("./routes/auth");

// Import task routes.
const taskRoutes = require("./routes/tasks");

// Import course routes.
const courseRoutes = require("./routes/courses");

// Import the PostgreSQL connection pool.
const pool = require("./db");

// Create the Express application.
const app = express();

// Tell Express that it is running behind Render's reverse proxy.
// This allows Express and express-rate-limit to correctly
// process forwarded client information such as X-Forwarded-For.
app.set("trust proxy", 1);

// Use Render's deployment port or port 3000 locally.
const PORT = process.env.PORT || 3000;

// Add security-related HTTP headers.
app.use(helmet());

// Allow requests from the React frontend.
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Parse JSON request bodies.
app.use(express.json());

// Parse HTTP cookies.
app.use(cookieParser());

// Limit repeated requests to the API.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        message: "Too many requests. Try again later."
    }
});

// Apply the general API rate limiter.
app.use("/api", apiLimiter);

// Basic health check.
app.get("/health", async function (req, res) {
    try {
        // Test the PostgreSQL connection.
        await pool.query("SELECT 1");

        // Report a healthy backend and database.
        res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        // Report that the database is unavailable.
        res.status(503).json({
            status: "error",
            database: "unavailable"
        });
    }
});

// Root endpoint.
app.get("/", function (req, res) {
    res.json({
        message: "Studyhub backend is running"
    });
});

// Authentication routes.
app.use("/api/auth", authRoutes);

// Protected task routes.
app.use("/api/tasks", taskRoutes);

// Course routes.
app.use("/api/courses", courseRoutes);

// Start the server.
app.listen(PORT, function () {
    console.log(
        `StudyHub backend running on port ${PORT}`
    );
});
