# Week 3 Notes — Results Page

## What we built
- GET /results/me endpoint in FastAPI
  - JWT-protected using HTTPBearer
  - Queries results → subjects → exam_sessions via SQLAlchemy joins
  - Returns full result response matching SIET portal layout
- Results page in React (ResultsPage.tsx)
  - Reads JWT from localStorage
  - Calls GET /results/me with Bearer token
  - Renders result table: SEM, SUBJECT CODE, SUBJECT NAME, GRADE, RESULT
  - Color-coded status: PASS=green, RA=red, WH=orange, WH1=dark red
  - Logout button clears token and redirects to login
- Simple client-side routing in App.tsx (/ → login, /results → results)

## New files created
- backend/app/models/result.py — Result, Subject, ExamSession models
- backend/app/schemas/result.py — ResultsResponse, ResultItem, ExamSessionInfo
- backend/app/api/results.py — GET /results/me endpoint
- backend/app/core/security.py — get_current_student JWT dependency
- frontend/src/pages/ResultsPage.tsx — result table UI
- frontend/src/App.tsx — client-side routing

## Milestone achieved
Full portal flow working locally:
localhost:5173 → login → JWT → GET /results/me → results table rendered
Deepak's register number 714024149040 + DOB → sees Semester 3 results

## What we learned
- How SQLAlchemy relationships work (joinedload)
- How JWT Bearer tokens are validated in FastAPI (Depends)
- How React useEffect fetches data on page load
- Why we store JWT in localStorage (and why httpOnly cookies are safer — future improvement)

## Decisions made
- Simple window.location routing instead of React Router — keeps Week 3 simple
- React Router will be added in Phase 2 when we have more pages
- result_status stored as plain string in SQLAlchemy (not Enum) to avoid
  PostgreSQL ENUM migration complexity at this stage

## Issues encountered and fixed
- ModuleNotFoundError app.models.result — file didn't exist, created it
- Pydantic v2 deprecation: class Config → ConfigDict
- SQLAlchemy 2.0 deprecation: declarative_base() moved to sqlalchemy.orm

## Next week (Week 4)
- Dockerize all three services
- docker-compose.yml for full local stack
- Nginx serving React in production mode