-- StudyHub PostgreSQL schema.
-- Run this file inside the studyhub database before starting the API.

-- Store registered accounts.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Store courses shown in the application.
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    progress INTEGER NOT NULL DEFAULT 0
        CHECK (progress BETWEEN 0 AND 100)
);

-- Store tasks belonging to individual users.
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Speed up the most common task ownership query.
CREATE INDEX IF NOT EXISTS idx_tasks_user_id
ON tasks(user_id);

-- Speed up account lookups by email.
CREATE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Insert initial course data without creating duplicates.
INSERT INTO courses (name, level, progress)
SELECT 'HTML', 'Beginner', 100
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE name = 'HTML'
);

INSERT INTO courses (name, level, progress)
SELECT 'CSS', 'Beginner', 80
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE name = 'CSS'
);

INSERT INTO courses (name, level, progress)
SELECT 'JavaScript', 'Intermediate', 60
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE name = 'JavaScript'
);

INSERT INTO courses (name, level, progress)
SELECT 'React', 'Intermediate', 40
WHERE NOT EXISTS (
    SELECT 1 FROM courses WHERE name = 'React'
);
