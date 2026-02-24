-- init.sql
-- Idempotent database initialization script for KLC Code IDE.
-- Safe to run on every deployment — tables are only created if they do not
-- already exist, so an existing schema is left untouched.

-- 1. Users table: stores Clerk-authenticated users with their roles.
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerkId VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Assignments table: stores assignments created by teachers.
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(100),
    subject VARCHAR(100),
    hash_userid_email VARCHAR(255) NOT NULL,
    total_score INTEGER,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Submissions table: stores student code submissions linked to assignments.
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    hash_userid_email VARCHAR(255) NOT NULL,
    code TEXT NOT NULL,
    assignment_id INTEGER NOT NULL REFERENCES assignments(id),
    language_id INTEGER NOT NULL,
    score INTEGER,
    feedback TEXT,
    date_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add the total_score column to assignments if it does not already exist.
-- This handles databases created before total_score was introduced.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'assignments' AND column_name = 'total_score'
    ) THEN
        ALTER TABLE assignments ADD COLUMN total_score INTEGER;
    END IF;
END
$$;

-- Add the score column to submissions if it does not already exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'score'
    ) THEN
        ALTER TABLE submissions ADD COLUMN score INTEGER;
    END IF;
END
$$;

-- Add the feedback column to submissions if it does not already exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'submissions' AND column_name = 'feedback'
    ) THEN
        ALTER TABLE submissions ADD COLUMN feedback TEXT;
    END IF;
END
$$;
