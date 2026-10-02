// Import Express.
const express = require("express");

// Import password hashing.
const bcrypt = require("bcryptjs");

// Import JWT creation.
const jwt = require("jsonwebtoken");

// Import the PostgreSQL connection pool.
const pool = require("../db");

// Import authentication middleware for /me.
const authenticateUser = require("../middleware/auth");

// Create the authentication router.
const router = express.Router();

// Create the authentication cookie consistently in development and production.
function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    });
}

// POST /api/auth/register
router.post("/register", async function (req, res) {
    try {
        // Read the submitted registration data.
        const { name, email, password } = req.body;

        // Validate the basic input on the server.
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            name.trim().length < 2 ||
            name.trim().length > 100 ||
            email.trim().length > 255 ||
            password.length < 8
        ) {
            return res.status(400).json({
                message: "Name, email and a password of at least 8 characters are required"
            });
        }

        // Normalize the email so duplicate addresses are handled consistently.
        const normalizedEmail = email.toLowerCase().trim();

        // Check whether the email is already registered.
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        // Hash the password before it is stored.
        const passwordHash = await bcrypt.hash(password, 12);

        // Insert the user and return only safe public fields.
        const result = await pool.query(
            `
            INSERT INTO users (name, email, password_hash)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, role
            `,
            [name.trim(), normalizedEmail, passwordHash]
        );

        // Create a login token for the new account.
        const user = result.rows[0];
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Store the token in an HTTP-only cookie.
        setAuthCookie(res, token);

        // Return the newly created safe user object.
        res.status(201).json({
            message: "Registration successful",
            user
        });
    } catch (error) {
        // Log server-side details without returning them to the client.
        console.error("Registration failed:", error.message);

        // Return a generic error to the client.
        res.status(500).json({
            message: "Registration failed"
        });
    }
});

// POST /api/auth/login
router.post("/login", async function (req, res) {
    try {
        // Read login credentials.
        const { email, password } = req.body;

        // Validate the request shape.
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Normalize the email before looking it up.
        const normalizedEmail = email.toLowerCase().trim();

        // Find the account.
        const result = await pool.query(
            "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
            [normalizedEmail]
        );

        // Use the same message for an unknown email and wrong password.
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Read the matching user record.
        const user = result.rows[0];

        // Compare the submitted password with the stored hash.
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Create a short-lived authentication token.
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Store the token in an HTTP-only cookie.
        setAuthCookie(res, token);

        // Never send the password hash to the browser.
        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // Log server-side details only.
        console.error("Login failed:", error.message);

        // Return a generic error.
        res.status(500).json({
            message: "Login failed"
        });
    }
});

// GET /api/auth/me
router.get("/me", authenticateUser, async function (req, res) {
    try {
        // Fetch the current user's public information.
        const result = await pool.query(
            "SELECT id, name, email, role FROM users WHERE id = $1",
            [req.user.id]
        );

        // Reject a token for an account that no longer exists.
        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Return safe account information.
        res.json({
            user: result.rows[0]
        });
    } catch (error) {
        // Log server-side details only.
        console.error("Failed to load current user:", error.message);

        // Return a generic error.
        res.status(500).json({
            message: "Failed to load user"
        });
    }
});

// POST /api/auth/logout
router.post("/logout", function (req, res) {
    // Remove the authentication cookie.
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    // Confirm logout.
    res.json({
        message: "Logout successful"
    });
});

// Export the router.
module.exports = router;
