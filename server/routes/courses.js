// Import Express.
const express = require("express");

// Import PostgreSQL.
const pool = require("../db");

// Create the course router.
const router = express.Router();

// GET /api/courses
// Courses are currently public study content.
router.get("/", async function (req, res) {
    try {
        // Retrieve courses from PostgreSQL.
        const result = await pool.query(
            "SELECT id, name, level, progress FROM courses ORDER BY id"
        );

        // Return the courses.
        res.json(result.rows);
    } catch (error) {
        console.error("Failed to fetch courses:", error.message);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

// GET /api/courses/:id
// Retrieve one course.
router.get("/:id", async function (req, res) {
    try {
        // Validate the URL ID.
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid course ID" });
        }

        // Query the selected course safely.
        const result = await pool.query(
            "SELECT id, name, level, progress FROM courses WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Failed to fetch course:", error.message);
        res.status(500).json({ message: "Failed to fetch course" });
    }
});

// Export the course router.
module.exports = router;
