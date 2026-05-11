# Week 2 Notes — Application Phase

## What we built
- React 19 + TypeScript frontend with Vite
- CRMS login page: register_number + date_of_birth (matches real SIET portal)
- FastAPI backend: 7 endpoints skeleton
- PostgreSQL: 7 tables, result_status ENUM, seed data
- JWT authentication working

## Milestone achieved
POST /auth/student/login → 200 OK
Full flow: React → FastAPI → PostgreSQL → JWT → React

## What we learned
- How SQLAlchemy models map to PostgreSQL tables
- How JWT tokens work (create → store → send in headers)
- How CORS works between React (5173) and FastAPI (8000)
- How DOB-based auth works (no password needed)

## Next week (Week 3)
- GET /results/me endpoint — fetch real results from DB
- Results page in React — table with subject, grade, status
- Faculty upload endpoint
- Redis caching for result lookups
