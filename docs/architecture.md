# CRMS Architecture

## The Problem
College result portals crash every result day when 5000+ students hit them simultaneously.

## Our Solution
A production-grade system built to handle 5000 concurrent users with:
- FastAPI backend with async support
- Redis caching layer (1 DB query serves thousands)
- Kubernetes auto-scaling (pods scale with traffic)
- Full observability (Prometheus + Grafana)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Backend API | FastAPI (Python) |
| Frontend | React 19 + TypeScript |
| Database | PostgreSQL 16 + PgBouncer |
| Cache | Redis 7 |
| Containers | Docker + Docker Compose |
| Orchestration | Kubernetes + Helm |
| CI/CD | GitHub Actions + ArgoCD |
| Cloud | AWS (EKS + RDS + S3) |
| IaC | Terraform + Terragrunt |
| Observability | Prometheus + Grafana + Loki |

## DB Schema (designed Week 1)
- **students** — id, roll_number, name, department, batch_year, email
- **subjects** — id, subject_code, subject_name, department, semester, credits
- **results** — id, student_id (FK), subject_id (FK), semester, grade, marks_obtained, exam_year
- **users** — id, email, hashed_password, role (student/faculty/admin)

## Team
- Jashwanth ([@JashwanthMU](https://github.com/JashwanthMU))
- Deepak ([@deepaklearneratcbe](https://github.com/deepaklearneratcbe))
