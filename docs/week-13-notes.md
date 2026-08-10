# Week 13 Notes — Alembic Database Migrations

## What we built
Auto-create all database tables on container startup.
No more manual SQL scripts on fresh deployments.

## The problem before Week 13
Every time we spun up a fresh Docker container or EKS cluster,
we had to manually paste 100+ lines of SQL into psql.
This is error-prone, slow, and not how production systems work.

## The solution: Alembic
Alembic is the standard database migration tool for SQLAlchemy.
It tracks schema changes as versioned files — like Git for your database.

## Files created
- backend/alembic.ini — Alembic configuration, DATABASE_URL connection
- backend/migrations/env.py — imports all SQLAlchemy models, runs migrations
- backend/migrations/script.py.mako — template for new migration files
- backend/migrations/versions/001_initial_schema.py — creates all 7 tables
- backend/migrations/versions/seed_initial_data.py — inserts SIET seed data
- backend/start.sh — runs alembic upgrade head before uvicorn starts
- backend/Dockerfile — updated CMD to use start.sh

## The two migrations

### Migration 001 — initial schema
Creates all 7 tables in correct dependency order:
1. branches (no dependencies)
2. regulations (no dependencies)
3. exam_sessions (no dependencies)
4. students (depends on branches, regulations)
5. subjects (depends on branches, regulations)
6. results (depends on students, subjects, exam_sessions)
7. users (no dependencies)

Also creates result_status_enum ENUM type with DO $$ BEGIN ... END $$ 
pattern to avoid duplicate errors on re-runs.

Creates 8 indexes for performance:
- idx_students_register_number — fastest lookup path
- idx_results_student_semester — result page query
- idx_results_published_at — filter published results
- idx_subjects_code — subject lookup

### Migration seed — SIET initial data
Inserts with ON CONFLICT DO NOTHING — safe to run multiple times:
- branches: CSE-CY (149), ECE (105), CIVIL (101), EEE (106)
- regulations: Anna University Regulation 2021
- exam_sessions: Nov/Dec 2025 END SEMESTER EXAMINATION RESULTS

## How it works on startup
```bash
# backend/start.sh runs this sequence:
echo "Running database migrations..."
alembic upgrade head        # creates tables if not exist, skips if already done
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Fresh EKS cluster + fresh PostgreSQL = docker-compose up creates
everything automatically. Zero manual intervention.

## Commands used
```bash
# Initialize alembic
alembic init migrations

# Generate migration from models
alembic revision --autogenerate -m "initial schema"

# Create manual migration
alembic revision -m "seed initial data"

# Run all pending migrations
alembic upgrade head

# Check current migration version
alembic current

# Roll back one migration
alembic downgrade -1
```

## Issues encountered and fixed
- SQLite vs PostgreSQL: alembic.ini must use port 5433 for local Docker
- result_status_enum: Alembic doesn't auto-generate PostgreSQL ENUMs
  Fix: manual DO $$ BEGIN CREATE TYPE ... EXCEPTION WHEN duplicate_object
- Auto-generated migration had ALTER TABLE instead of CREATE TABLE
  Fix: deleted auto-generated file, wrote clean 001_initial_schema.py manually
- password mismatch between alembic.ini and docker-compose.yml
  Fix: ensured both use same POSTGRES_PASSWORD value

## What we learned
- How Alembic tracks migration history in alembic_version table
- Why migration order matters: foreign keys require parent tables first
- How ON CONFLICT DO NOTHING makes seed migrations idempotent
- Why start.sh pattern is standard in production containers
- How DATABASE_URL env var overrides alembic.ini at runtime

## Before vs After
Before: Fresh cluster → paste 100 lines SQL → manually seed data → app works
After:  Fresh cluster → docker-compose up → everything automatic in 30 seconds

## Solution for this
"How do you manage database schema changes in production?"
  Alembic migrations committed to Git, run automatically on container startup.
  Each migration is versioned, reversible, and idempotent. CI catches
  migration errors before they reach production.
