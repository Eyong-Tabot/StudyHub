// Load environment variables.
require("dotenv").config();

// Import PostgreSQL's connection pool.
const { Pool } = require("pg");

// Use Render's DATABASE_URL in production.
// Use the individual DB_* variables during local development.
const pool = process.env.DATABASE_URL
    ? new Pool({
        // Render provides the complete PostgreSQL connection URL.
        connectionString: process.env.DATABASE_URL
    })
    : new Pool({
        // Local development database settings.
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME
    });

// Report database errors without exposing credentials.
pool.on("error", function (error) {
    console.error(
        "Unexpected PostgreSQL pool error:",
        error.message
    );
});

// Export the database pool.
module.exports = pool;
