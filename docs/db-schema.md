# CRMS Database Schema

## Design decisions
- PostgreSQL 16 — relational, ACID-compliant, handles concurrent reads well
- PgBouncer sits in front — pools connections so 5000 students don't open 5000 DB connections
- UUIDs as primary keys — safer than sequential integers for public-facing APIs
- `published_at` on results — results are uploaded but only visible after faculty publishes

---

## Table: students
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| roll_number | VARCHAR(20) | UNIQUE, NOT NULL | e.g. "21CS001" |
| name | VARCHAR(100) | NOT NULL | |
| department | VARCHAR(50) | NOT NULL | e.g. "CSE", "ECE" |
| batch_year | INTEGER | NOT NULL | e.g. 2021 |
| email | VARCHAR(100) | UNIQUE | optional |
| created_at | TIMESTAMP | DEFAULT now() | |

---

## Table: subjects
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| subject_code | VARCHAR(20) | UNIQUE, NOT NULL | e.g. "CS301" |
| subject_name | VARCHAR(100) | NOT NULL | e.g. "Operating Systems" |
| department | VARCHAR(50) | NOT NULL | |
| semester | INTEGER | NOT NULL | 1–8 |
| credits | INTEGER | NOT NULL | |

---

## Table: results
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| student_id | UUID | FK → students.id, NOT NULL | |
| subject_id | UUID | FK → subjects.id, NOT NULL | |
| semester | INTEGER | NOT NULL | |
| grade | VARCHAR(5) | NOT NULL | e.g. "A+", "B", "F" |
| marks_obtained | NUMERIC(5,2) | NOT NULL | e.g. 87.50 |
| max_marks | NUMERIC(5,2) | NOT NULL DEFAULT 100 | |
| exam_year | INTEGER | NOT NULL | |
| published_at | TIMESTAMP | NULLABLE | NULL = not yet published |
| created_at | TIMESTAMP | DEFAULT now() | |

UNIQUE(student_id, subject_id, semester, exam_year)

---

## Table: users
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | |
| email | VARCHAR(100) | UNIQUE, NOT NULL | |
| hashed_password | TEXT | NOT NULL | bcrypt hashed, never plaintext |
| role | VARCHAR(20) | NOT NULL | 'student', 'faculty', 'admin' |
| is_active | BOOLEAN | DEFAULT true | |
| created_at | TIMESTAMP | DEFAULT now() | |

---

## Relationships
- results.student_id → students.id (many results per student)
- results.subject_id → subjects.id (many results per subject)
- users is separate — a faculty user uploads results, students view them

## Indexes 
- students(roll_number) — most common lookup
- results(student_id, semester) — fetch all results for a student in a semester
- results(published_at) — filter only published results