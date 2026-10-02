// Import Express.
const express = require("express");

// Import PostgreSQL.
const pool = require("../db");

// Import authentication middleware.
const authenticateUser = require("../middleware/auth");

// Create the task router.
const router = express.Router();

// Every task belongs to an authenticated user.
router.use(authenticateUser);

// GET /api/tasks
// Return only the current user's tasks.
router.get("/", async function (req, res) {
    try {
        // Retrieve the user's tasks from PostgreSQL.
        const result = await pool.query(
            `
            SELECT id, text, completed, created_at
            FROM tasks
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [req.user.id]
        );

        // Return the tasks.
        res.json(result.rows);
    } catch (error) {
        console.error("Failed to fetch tasks:", error.message);
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
});

// GET /api/tasks/:id
// Return one task owned by the current user.
router.get("/:id", async function (req, res) {
    try {
        // Validate the URL ID.
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        // Restrict the query to the authenticated user.
        const result = await pool.query(
            `
            SELECT id, text, completed, created_at
            FROM tasks
            WHERE id = $1 AND user_id = $2
            `,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Failed to fetch task:", error.message);
        res.status(500).json({ message: "Failed to fetch task" });
    }
});

// POST /api/tasks
// Create a task for the current user.
router.post("/", async function (req, res) {
    try {
        // Read the submitted task text.
        const { text } = req.body;

        // Validate the text.
        if (
            typeof text !== "string" ||
            text.trim().length === 0 ||
            text.trim().length > 255
        ) {
            return res.status(400).json({
                message: "Task text must contain 1 to 255 characters"
            });
        }

        // Insert the task using a parameterized query.
        const result = await pool.query(
            `
            INSERT INTO tasks (user_id, text)
            VALUES ($1, $2)
            RETURNING id, text, completed, created_at
            `,
            [req.user.id, text.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Failed to create task:", error.message);
        res.status(500).json({ message: "Failed to create task" });
    }
});

// PATCH /api/tasks/:id
// Update a task owned by the current user.
router.patch("/:id", async function (req, res) {
    try {
        // Validate the task ID.
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        // Accept only the fields that the API is designed to update.
        const hasCompleted = typeof req.body.completed === "boolean";
        const hasText =
            typeof req.body.text === "string" &&
            req.body.text.trim().length > 0 &&
            req.body.text.trim().length <= 255;

        if (!hasCompleted && !hasText) {
            return res.status(400).json({
                message: "A valid completed or text value is required"
            });
        }

        // Update the supplied fields while keeping ownership enforced.
        const result = await pool.query(
            `
            UPDATE tasks
            SET
                completed = CASE
                    WHEN $3 THEN $4
                    ELSE completed
                END,
                text = CASE
                    WHEN $5 THEN $6
                    ELSE text
                END
            WHERE id = $1 AND user_id = $2
            RETURNING id, text, completed, created_at
            `,
            [
                id,
                req.user.id,
                hasCompleted,
                req.body.completed,
                hasText,
                hasText ? req.body.text.trim() : null
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Failed to update task:", error.message);
        res.status(500).json({ message: "Failed to update task" });
    }
});

// DELETE /api/tasks/:id
// Delete a task owned by the current user.
router.delete("/:id", async function (req, res) {
    try {
        // Validate the task ID.
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ message: "Invalid task ID" });
        }

        // Delete only when the task belongs to the current user.
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(204).send();
    } catch (error) {
        console.error("Failed to delete task:", error.message);
        res.status(500).json({ message: "Failed to delete task" });
    }
});

// Export the task router.
module.exports = router;
