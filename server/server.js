// Load environment variables before starting the application.
require("dotenv").config();

// Import Express.
const express = require("express");

// Import CORS support.
const cors = require("cors");

// Import HTTP-only cookie parsing.
const cookieParser = require("cookie-parser");

// Import security headers.
const helmet = require("helmet");

// Import API rate limiting.
const rateLimit = require("express-rate-limit");

// Import the database pool for health checks.
const pool = require("./db");

// Import API routes.
const taskRoutes = require("./routes/tasks");
const courseRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");

// Create the Express application.
const app = express();

// Use the hosting provider's port or 3000 locally.
const PORT = process.env.PORT || 3000;

// Reject startup when critical secrets are missing.
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
}

// Add security-related HTTP headers.
app.use(helmet());

// Allow only the configured frontend to send credentialed requests.
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Parse JSON request bodies.
app.use(express.json({ limit: "100kb" }));

// Parse authentication cookies.
app.use(cookieParser());

// Apply a general API request limit.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: {
        message: "Too many requests. Try again later."
    }
});

// Apply the limiter to all API endpoints.
app.use("/api", apiLimiter);

// Health endpoint used for local and deployment checks.
app.get("/health", async function (req, res) {
    try {
        // Confirm that PostgreSQL is reachable.
        await pool.query("SELECT 1");

        // Report a healthy application.
        res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        // Report an unhealthy dependency without exposing details.
        console.error("Health check failed:", error.message);

        res.status(503).json({
            status: "error",
            database: "unavailable"
        });
    }
});

// Simple root endpoint.
app.get("/", function (req, res) {
    res.json({
        message: "StudyHub backend is running"
    });
});

// Authentication endpoints.
app.use("/api/auth", authRoutes);

// Public course endpoints.
app.use("/api/courses", courseRoutes);

// Protected task endpoints.
app.use("/api/tasks", taskRoutes);

// Start the API server.
app.listen(PORT, function () {
    console.log(`StudyHub backend running on port ${PORT}`);
});
