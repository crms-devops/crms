# Week 4 Notes — Docker + Containers

## What we built
- backend/Dockerfile — multi-stage Python 3.13-slim-bookworm build
  - Stage 1 (builder): installs dependencies with pip --user
  - Stage 2 (runtime): copies from builder, runs uvicorn
- frontend/Dockerfile — multi-stage Node 20 + nginx alpine
  - Stage 1 (builder): npm ci + npm run build
  - Stage 2 (runtime): nginx serves /dist as static files
- frontend/nginx.conf — nginx config
  - Serves React SPA with try_files for client-side routing
  - Proxies /api/ to backend:8000
- docker-compose.yml — orchestrates all 3 services
  - db: postgres:16-alpine with health check
  - backend: depends on db health, mounts app/ for hot reload
  - frontend: depends on backend
- .dockerignore files — excludes venv/, node_modules/, .env

## Key learning: Docker networking
Inside docker-compose, services talk to each other by service name:
- backend connects to db via DATABASE_URL=postgresql://postgres:pass@db:5432/crms_dev
- frontend nginx proxies to backend:8000
- Your laptop connects via localhost:80 (frontend) and localhost:8000 (backend)

## CORS fix for Docker
React inside Docker runs on port 80 (not 5173).
Added http://localhost and http://localhost:80 to FastAPI CORS allow_origins.

## Migration lesson
Docker PostgreSQL starts empty — no tables.
Had to run migration manually inside container:
  docker exec -it crms_db psql -U postgres -d crms_dev
Then pasted full SQL migration script to create 7 tables + seed data.
This is why Alembic auto-migrations matter — Week 6 TODO.

## Commands used
```bash
# Build and start all containers
docker-compose up --build

# Access PostgreSQL inside Docker
docker exec -it crms_db psql -U postgres -d crms_dev

# View running containers
docker ps

# Stop all containers
docker-compose down

# Stop and remove volumes (fresh DB)
docker-compose down -v
```

## Milestone achieved
docker-compose up --build → all 3 containers running
http://localhost → CRMS login page served by nginx
POST /auth/student/login 200 OK inside Docker
Full login + results flow verified inside containers

## Issues encountered and fixed
- SQLAlchemy==2.0.49 not found on Docker pip mirror → pinned to 2.0.36
- CORS blocking OPTIONS preflight from nginx port 80 → added to allow_origins
- docker exec ran in Linux shell not psql → used correct command with psql flag

## Next week (Week 5)
- GitHub Actions CI/CD pipeline
- Automated pytest on every push
- Trivy container security scanning