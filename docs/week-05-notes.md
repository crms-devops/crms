# Week 5 Notes — GitHub Actions CI/CD Pipeline

## What we built

### CI Pipeline (.github/workflows/ci.yml)
Triggers on every push to any branch and every PR to develop/main.

Three jobs run in parallel then sequence:

**Job 1: backend-test**
- Spins up Ubuntu runner + PostgreSQL 16 service container
- Installs Python 3.13 + requirements
- Sets PYTHONPATH so pytest can find app module
- Creates all DB tables via Base.metadata.create_all() in conftest.py
- Runs pytest tests/

**Job 2: frontend-lint**
- Installs Node 20 + npm ci
- Runs ESLint on frontend TypeScript code

**Job 3: docker-build-scan** (runs after jobs 1+2 pass)
- Builds backend Docker image
- Builds frontend Docker image
- Runs Trivy scan on both images
- Blocks on CRITICAL CVEs (exit-code: 1)
- ignore-unfixed: true skips OS CVEs with no available patch

### CD Pipeline (.github/workflows/cd.yml)
Triggers only on push to main.
- Logs into GitHub Container Registry (GHCR)
- Builds and pushes backend image: ghcr.io/crms-devops/crms-backend:latest + SHA tag
- Builds and pushes frontend image: ghcr.io/crms-devops/crms-frontend:latest + SHA tag

## Real CVE caught by pipeline
**CVE-2024-33663** — CRITICAL
- Package: python-jose 3.3.0
- Issue: algorithm confusion with OpenSSH ECDSA keys
- Impact: potential JWT token forgery — attacker could login as any student
- Fix: upgraded to python-jose 3.4.0
- This was caught automatically by Trivy before it reached production

## Test files created
- backend/tests/conftest.py — TestClient fixture + create_all/drop_all
- backend/tests/test_health.py — 3 tests:
  - GET /health → 200 OK
  - POST /auth/student/login missing fields → 422
  - POST /auth/student/login invalid credentials → 401

## Deprecations fixed
- Pydantic v2: class Config → ConfigDict in schemas/auth.py and schemas/result.py
- SQLAlchemy 2.0: declarative_base() moved to sqlalchemy.orm

## Commands used
```bash
# Check CI status
# Go to github.com/crms-devops/crms/actions

# Run tests locally
cd backend
venv\Scripts\activate
python -m pytest tests/ -v

# Run Trivy locally (if installed)
trivy image crms-backend:latest
```

## Milestone achieved
All 3 CI jobs passing on every push.
CD pushes images to GHCR on main merge.
Pipeline caught CVE-2024-33663 and blocked merge until fixed.
Images available at:
  ghcr.io/crms-devops/crms-backend:latest
  ghcr.io/crms-devops/crms-frontend:latest

## What we learned
- How GitHub Actions jobs, steps, and services work
- How pytest fixtures with scope="session" work
- How Trivy scans Python packages for CVEs
- Difference between fixable CVEs (upgrade the package) vs unfixed CVEs (OS level)
- Why SHA-tagged Docker images matter for traceability

## Next week (Week 6)
- Install Terraform + AWS CLI
- Create AWS IAM user for Terraform
- Write VPC module: subnets, route tables, IGW, NAT gateway
- Write EKS module: control plane + node group
- terraform apply creates real AWS infrastructure from code