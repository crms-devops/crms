**CRMS**
College Result Management System
Database Schema 
**1\. Overview**

This document extends the base CRMS schema to fully support the result portal as implemented at Sri Shakthi Institute of Engineering and Technology (siet.ac.in). The design is open-source and college-agnostic - any institution can deploy CRMS and configure it for their own semester structure, regulations, and branding.

Key additions driven by the result page:

- Regulation year per student (e.g. 2021 batch)
- Degree & branch with numeric branch code (e.g. 149 for CSE-Cyber Security)
- Exam session table (Nov/Dec 2025, Apr/May 2026 …)
- Result status enum with all official codes
- Subject type flag (theory vs laboratory)
- Date of birth stored on student for portal login (DOB-based auth)

**2\. Design Decisions**

| **Decision**          | **Rationale**                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| PostgreSQL 16         | Relational, ACID-compliant, handles concurrent reads from 5,000+ students                            |
| PgBouncer             | Connection pooling - prevents DB exhaustion under exam-day traffic spikes                            |
| UUID PKs              | Safer than sequential integers for public-facing APIs; no enumeration attacks                        |
| published_at nullable | Results are uploaded before the announcement date; NULL means not yet visible                        |
| result_status ENUM    | Enforces only valid official codes (PASS, RA, RA_ABSENT, WH, WH1, NC) at the DB level                |
| exam_sessions table   | Decouples session metadata from results; one row per exam window (Nov/Dec, Apr/May)                  |
| branches table        | Supports numeric branch codes (e.g. 149) used by affiliating university; reusable across regulations |

**3\. Result Status Reference**

The following status codes are captured from the official result portal. The ENUM is defined at the database level for integrity.

| **Code** | **DB ENUM Value** | **Display Label** | **Meaning**                                    |
| -------- | ----------------- | ----------------- | ---------------------------------------------- |
| PASS     | PASS              | PASS              | Student has passed the subject                 |
| RA       | RA_FAIL           | RA - FAIL         | Failed; must re-appear in supplementary exam   |
| RA\*     | RA_ABSENT         | RA\* - ABSENT     | Absent for the examination; treated as fail    |
| WH       | WH_WITHHELD       | WH - WITHHELD     | Result withheld (pending fee / dues clearance) |
| WH1      | WH1_MALPRACTICE   | WH1 - MALPRACTICE | Failed due to malpractice in exam hall         |
| NC       | NC_NO_CHANGE      | NC - NO CHANGE    | Grade unchanged from previous attempt          |

**4\. Table Schemas**

**4.1 branches**

Stores each degree-branch combination offered by the college, along with the numeric code used by the affiliating university.

| **Column**  | **Type**     | **Constraints**                        | **Notes**                                               |
| ----------- | ------------ | -------------------------------------- | ------------------------------------------------------- |
| id          | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() |                                                         |
| branch_code | VARCHAR(10)  | UNIQUE, NOT NULL                       | e.g. '149' (Anna University code for CSE-CyberSec)      |
| degree      | VARCHAR(10)  | NOT NULL                               | e.g. 'B.E.', 'B.Tech', 'M.E.'                           |
| branch_name | VARCHAR(150) | NOT NULL                               | e.g. 'Computer Science and Engineering(Cyber Security)' |
| short_name  | VARCHAR(20)  | NOT NULL                               | e.g. 'CSE-CY', 'ECE'                                    |
| department  | VARCHAR(50)  | NOT NULL                               | Parent dept; used to group branches on portal           |
| created_at  | TIMESTAMP    | DEFAULT now()                          |                                                         |

**4.2 regulations**

Each regulation year defines the curriculum version. Students are enrolled under one regulation for their full programme.

| **Column**      | **Type**  | **Constraints**                        | **Notes**                                               |
| --------------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| id              | UUID      | PRIMARY KEY, DEFAULT gen_random_uuid() |                                                         |
| regulation_year | INTEGER   | UNIQUE, NOT NULL                       | e.g. 2021 - matches the regulation label on result page |
| description     | TEXT      | NULLABLE                               | Optional: 'Anna University Regulation 2021'             |
| is_active       | BOOLEAN   | DEFAULT true                           | False for old regulations still in result history       |
| created_at      | TIMESTAMP | DEFAULT now()                          |                                                         |

**4.3 exam_sessions**

One row per examination window. Results are always linked to a session, enabling the portal to display the header 'Nov/Dec 2025 END SEMESTER EXAMINATION RESULTS'.

| **Column**    | **Type**    | **Constraints**                        | **Notes**                                                                 |
| ------------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------- |
| id            | UUID        | PRIMARY KEY, DEFAULT gen_random_uuid() |                                                                           |
| session_name  | VARCHAR(20) | NOT NULL                               | e.g. 'NOV_DEC' or 'APR_MAY'                                               |
| exam_year     | INTEGER     | NOT NULL                               | e.g. 2025                                                                 |
| display_label | VARCHAR(60) | NOT NULL                               | e.g. 'Nov/Dec 2025 END SEMESTER EXAMINATION RESULTS'                      |
| starts_on     | DATE        | NULLABLE                               | Approx exam start date                                                    |
| ends_on       | DATE        | NULLABLE                               | Approx exam end date                                                      |
| is_published  | BOOLEAN     | DEFAULT false                          | Global gate - if false, no results are visible regardless of published_at |
| created_at    | TIMESTAMP   | DEFAULT now()                          |                                                                           |
|               |             | UNIQUE(session_name, exam_year)        | Prevents duplicate sessions                                               |

**4.4 students (extended from v1)**

Extended with regulation, branch link, degree, and date of birth. The portal uses register_number + date_of_birth for login - no password required for students.

| **Column**       | **Type**     | **Constraints**                         | **Notes**                                     |
| ---------------- | ------------ | --------------------------------------- | --------------------------------------------- |
| id               | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()  |                                               |
| register_number  | VARCHAR(20)  | UNIQUE, NOT NULL                        | Portal login key - e.g. '714024149040'        |
| name             | VARCHAR(100) | NOT NULL                                | Full name as per records                      |
| date_of_birth    | DATE         | NOT NULL                                | Used as portal password; e.g. '2005-05-08'    |
| branch_id        | UUID         | FK → branches.id, NOT NULL              | Replaces the old plain-text department column |
| regulation_id    | UUID         | FK → regulations.id, NOT NULL           | e.g. regulation_year=2021                     |
| batch_year       | INTEGER      | NOT NULL                                | Year of joining; e.g. 2024                    |
| current_semester | INTEGER      | CHECK(current_semester BETWEEN 1 AND 8) | Latest active semester                        |
| email            | VARCHAR(100) | UNIQUE, NULLABLE                        | Optional; for notifications                   |
| is_active        | BOOLEAN      | DEFAULT true                            | False for alumni / withdrawn                  |
| created_at       | TIMESTAMP    | DEFAULT now()                           |                                               |

**4.5 subjects (extended from v1)**

Subject codes carry encoded information: prefix digits = regulation year, letter prefix = department, numeric suffix = running index. The subject_type flag differentiates theory from laboratory papers (labs follow a different grading scale).

| **Column**    | **Type**     | **Constraints**                           | **Notes**                                        |
| ------------- | ------------ | ----------------------------------------- | ------------------------------------------------ |
| id            | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid()    |                                                  |
| subject_code  | VARCHAR(20)  | UNIQUE, NOT NULL                          | e.g. '21CY303' - 21=reg year, CY=dept, 303=index |
| subject_name  | VARCHAR(150) | NOT NULL                                  | e.g. 'Cryptography and Cyber Security'           |
| branch_id     | UUID         | FK → branches.id, NOT NULL                | Which branch this subject belongs to             |
| regulation_id | UUID         | FK → regulations.id, NOT NULL             | Links subject to the curriculum version          |
| semester      | INTEGER      | NOT NULL, CHECK(semester BETWEEN 1 AND 8) | 1-8                                              |
| subject_type  | VARCHAR(10)  | NOT NULL, CHECK IN ('THEORY','LAB')       | LAB subjects end in '1','2','3' by convention    |
| credits       | INTEGER      | NOT NULL                                  | Credit weightage                                 |
| created_at    | TIMESTAMP    | DEFAULT now()                             |                                                  |

**4.6 results (extended from v1)**

Central fact table. Each row is one student's result for one subject in one exam session. The result_status ENUM replaces the old free-text grade approach and mirrors every code visible on the result portal.

| **Column**      | **Type**           | **Constraints**                                 | **Notes**                                                                            |
| --------------- | ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| id              | UUID               | PRIMARY KEY, DEFAULT gen_random_uuid()          |                                                                                      |
| student_id      | UUID               | FK → students.id, NOT NULL                      |                                                                                      |
| subject_id      | UUID               | FK → subjects.id, NOT NULL                      |                                                                                      |
| exam_session_id | UUID               | FK → exam_sessions.id, NOT NULL                 | e.g. Nov/Dec 2025 session                                                            |
| semester        | INTEGER            | NOT NULL                                        | Redundant but fast; avoids JOIN on subjects for semester filter                      |
| grade           | VARCHAR(5)         | NULLABLE                                        | e.g. 'A+', 'B', 'O'; NULL when result withheld or absent                             |
| marks_obtained  | NUMERIC(5,2)       | NULLABLE                                        | NULL allowed for withheld / malpractice cases                                        |
| max_marks       | NUMERIC(5,2)       | NOT NULL DEFAULT 100                            |                                                                                      |
| result_status   | result_status_enum | NOT NULL                                        | ENUM: PASS \| RA_FAIL \| RA_ABSENT \| WH_WITHHELD \| WH1_MALPRACTICE \| NC_NO_CHANGE |
| attempt_number  | INTEGER            | NOT NULL DEFAULT 1                              | 1st attempt, 2nd (arrear), etc.                                                      |
| published_at    | TIMESTAMP          | NULLABLE                                        | NULL = not yet published to student portal                                           |
| created_at      | TIMESTAMP          | DEFAULT now()                                   |                                                                                      |
|                 |                    | UNIQUE(student_id, subject_id, exam_session_id) | One result per student per subject per session                                       |

**4.7 users (unchanged from v1)**

Faculty and admin accounts. Student portal access is register_number + DOB - no user row needed for students.

| **Column**      | **Type**     | **Constraints**                        | **Notes**                                 |
| --------------- | ------------ | -------------------------------------- | ----------------------------------------- |
| id              | UUID         | PRIMARY KEY, DEFAULT gen_random_uuid() |                                           |
| email           | VARCHAR(100) | UNIQUE, NOT NULL                       |                                           |
| hashed_password | TEXT         | NOT NULL                               | bcrypt hashed; never plaintext            |
| role            | VARCHAR(20)  | NOT NULL                               | 'faculty' \| 'admin' \| 'exam_controller' |
| is_active       | BOOLEAN      | DEFAULT true                           |                                           |
| created_at      | TIMESTAMP    | DEFAULT now()                          |                                           |

**5\. PostgreSQL ENUM**

Run this migration once per database before creating the results table:

CREATE TYPE result_status_enum AS ENUM (

'PASS',

'RA_FAIL', -- RA : Failed

'RA_ABSENT', -- RA\* : Absent

'WH_WITHHELD', -- WH : Withheld

'WH1_MALPRACTICE', -- WH1 : Fail due to malpractice

'NC_NO_CHANGE' -- NC : No change

);

**6\. Relationships**

| **From**                | **To**           | **Cardinality**                |
| ----------------------- | ---------------- | ------------------------------ |
| students.branch_id      | branches.id      | Many students → one branch     |
| students.regulation_id  | regulations.id   | Many students → one regulation |
| subjects.branch_id      | branches.id      | Many subjects → one branch     |
| subjects.regulation_id  | regulations.id   | Many subjects → one regulation |
| results.student_id      | students.id      | Many results per student       |
| results.subject_id      | subjects.id      | Many results per subject       |
| results.exam_session_id | exam_sessions.id | Many results per exam session  |

**7\. Indexes**

| **Index**                          | **Table** | **Purpose**                                     |
| ---------------------------------- | --------- | ----------------------------------------------- |
| students(register_number)          | students  | Primary portal lookup (login + result fetch)    |
| students(date_of_birth)            | students  | DOB-based auth query (combined with reg no.)    |
| students(branch_id, regulation_id) | students  | Admin bulk queries by branch + regulation       |
| results(student_id, semester)      | results   | Fetch all results for a student in a semester   |
| results(exam_session_id)           | results   | Filter results by exam session for bulk publish |
| results(published_at)              | results   | Only show published rows on student portal      |
| results(result_status)             | results   | Arrear / withhold reports for exam controller   |
| subjects(subject_code)             | subjects  | Subject lookup by code during bulk upload       |

**8\. Multi-College Deployment**

CRMS is open-source. Any college can fork and deploy it. Two strategies are supported:

**Strategy A - Schema-per-College (Recommended)**

Each college gets its own PostgreSQL schema (namespace) inside a shared cluster. Tables are identical; data is isolated.

| **Advantage**                            | **Trade-off**                                 |
| ---------------------------------------- | --------------------------------------------- |
| Complete data isolation between colleges | Slightly more complex migration tooling       |
| One migration script runs per schema     | Cannot cross-query colleges (by design)       |
| Easy to drop/archive a college           | Requires schema parameter in every connection |

**Strategy B - college_id Column**

Add a college_id UUID column to every table. Simpler initial setup; requires row-level security (RLS) policies to prevent data leakage across colleges.

**9\. Sample Portal Query**

This query replicates exactly what is shown on the result page after a student logs in with register_number + date_of_birth:

SELECT

s.register_number, s.name, s.date_of_birth,

reg.regulation_year,

b.degree, b.branch_name, b.branch_code,

r.semester, sub.subject_code, sub.subject_name,

r.grade, r.result_status

FROM results r

JOIN students s ON s.id = r.student_id

JOIN subjects sub ON sub.id = r.subject_id

JOIN branches b ON b.id = s.branch_id

JOIN regulations reg ON reg.id = s.regulation_id

JOIN exam_sessions es ON es.id = r.exam_session_id

WHERE s.register_number = \$1

AND s.date_of_birth = \$2 -- Portal password

AND r.published_at IS NOT NULL

AND es.is_published = true

ORDER BY r.semester, sub.subject_code;

ℹ _\$1 = register_number (e.g. '714024149040'), \$2 = date_of_birth (e.g. '2005-05-08'). Both conditions must match - mimicking the two-field login on the portal._

**10\. Changelog from v1**

| **Version** | **Table**          | **Change**                                                                                 |
| ----------- | ------------------ | ------------------------------------------------------------------------------------------ |
| v2.0        | NEW: branches      | New table replacing plain department string; includes branch_code                          |
| v2.0        | NEW: regulations   | New table for regulation year (2021, 2017, etc.)                                           |
| v2.0        | NEW: exam_sessions | New table for exam windows (Nov/Dec, Apr/May)                                              |
| v2.0        | students           | Added date_of_birth, branch_id FK, regulation_id FK, current_semester                      |
| v2.0        | subjects           | Added branch_id FK, regulation_id FK, subject_type (THEORY/LAB)                            |
| v2.0        | results            | Replaced free-text grade with result_status ENUM; added exam_session_id FK, attempt_number |

