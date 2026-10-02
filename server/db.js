// Load environment variables before reading database settings.
require("dotenv").config();

// Import PostgreSQL's connection pool.
const { Pool } = require("pg");

// Create reusable database connections.
const pool = new Pool({
    // Read all connection details from environment variables.
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME
});

// Report unexpected idle-client errors without exposing secrets.
pool.on("error", function (error) {
    console.error("Unexpected PostgreSQL pool error:", error.message);
});

// Export the pool so route files can query PostgreSQL.
module.exports = pool;
