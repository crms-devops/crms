# CRMS DevSecOps Pipeline Design

## Overview
19-gate security pipeline across 6 layers.
Designed for production deployment on AWS EKS.
Target implementation: after Week 16 DevOps foundation.

## Pipeline Stages

### PRE-FLIGHT SECURITY
1. **Gitleaks / TruffleHog** — secret scanning. BLOCKS on any finding.
2. **Hadolint** — Dockerfile lint. BLOCKS on errors.
3. **Checkov** — IaC + K8s manifest scan. BLOCKS on HIGH/CRITICAL.
4. **TerraSecure** — ML-powered Terraform scan (custom tool). BLOCKS on HIGH risk.

### CODE QUALITY + SAST
5. **Bandit** — SAST for Python. BLOCKS on HIGH severity.
6. **ESLint security plugin** — SAST for TypeScript.
7. **SonarQube** — quality gate. BLOCKS if gate fails.

### DEPENDENCY + SUPPLY CHAIN
8. **Snyk** — dependency CVE scan. BLOCKS on HIGH/CRITICAL.
9. **Syft** — SBOM generation in CycloneDX format. Stored as pipeline artifact.

### CONTAINER SECURITY
10. Docker build
11. **Trivy** — image scan. BLOCKS on HIGH/CRITICAL CVEs.
12. Push to AWS ECR.

### DEPLOYMENT + RUNTIME SECURITY
13. ArgoCD sync → EKS staging environment
14. **OWASP ZAP** — DAST against staging. BLOCKS on HIGH alerts.
15. **OPA** — admission control policy check. BLOCKS non-compliant workloads.
16. **Prometheus smoke test** — response time + error rate health check.

### PRODUCTION
17. Manual approval gate (or auto-promote if all gates pass)
18. ArgoCD promote → EKS production
19. Slack/email deployment alert with security summary

## Why each tool was chosen

| Tool | Reason |
|------|--------|
| TerraSecure | Own ML model — catches Terraform misconfigs others miss |
| Syft SBOM | Compliance requirement — proves full software supply chain visibility |
| OWASP ZAP | Only tool that tests the RUNNING application, not just code |
| OPA | Policy as code — security rules enforced at Kubernetes level |
| Gitleaks | Prevents secrets from ever entering git history |


## Pipeline Architecture

Push to GitHub
│
▼
┌─────────────────────────────────────────┐
│ PRE-FLIGHT GATES (4) │
│ Gate 1: TruffleHog - Secret Scan │
│ Gate 2: Hadolint - Dockerfile Lint │
│ Gate 3: Checkov - IaC Security │
│ Gate 4: TerraSecure - ML IaC Scan │
└─────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ SAST GATES (3) │
│ Gate 5: Bandit - Python SAST │
│ Gate 6: ESLint Security - TS SAST │
│ Gate 7: SonarQube - Quality Gate │
└─────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ SUPPLY CHAIN GATES (2) │
│ Gate 8: Snyk - Dependency CVE Scan │
│ Gate 9: Syft - SBOM Generation │
└─────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────┐
│ RUNTIME GATES (3) │
│ Gate 10: OWASP ZAP - DAST Scan │
│ Gate 11: OPA - Policy Validation │
│ Gate 12: Vault - Secrets Check │
└─────────────────────────────────────────┘
│
▼
DEPLOY (ArgoCD → EKS)


## Gate Details

| Gate | Tool | What it catches | Blocks? |
|------|------|----------------|---------|
| 1 | TruffleHog | AWS keys, tokens, passwords in code | Yes |
| 2 | Hadolint | Dockerfile bad practices, root user | Yes |
| 3 | Checkov | Terraform misconfigs, K8s security | Reports |
| 4 | TerraSecure | ML-detected IaC vulnerabilities | Reports |
| 5 | Bandit | SQL injection, weak crypto in Python | Yes (HIGH) |
| 6 | ESLint security | XSS, prototype pollution in TypeScript | Yes |
| 7 | SonarQube | Code quality, coverage, tech debt | Yes |
| 8 | Snyk | CVEs in Python + Node dependencies | Yes (HIGH) |
| 9 | Syft SBOM | Generates software bill of materials | No (report) |
| 10 | OWASP ZAP | XSS, SQLi, auth bypass at runtime | Reports |
| 11 | OPA | K8s policy violations | Yes |
| 12 | Vault | Hardcoded secrets detection | Yes |

## Real findings caught during development

| Finding | Gate | Severity | Fix |
|---------|------|----------|-----|
| CVE-2024-33663 python-jose | Trivy | CRITICAL | Upgraded to 3.4.0 |
| Kafka missing liveness probe | OPA Gate 11 | HIGH | Added health check |
| Public EKS endpoint | Checkov Gate 3 | MEDIUM | Documented as dev |
| No NetworkPolicy | Checkov Gate 3 | MEDIUM | Added networkpolicy.yaml |
| Containers running as root | Checkov Gate 3 | HIGH | Added runAsUser: 10001 |

## Workflows

| File | Gates |
|------|-------|
| .github/workflows/ci.yml | pytest + ESLint + Trivy + Docker |
| .github/workflows/cd.yml | GHCR push on main merge |
| .github/workflows/devsecops-preflight.yml | Gates 1-4 |
| .github/workflows/devsecops-sast.yml | Gates 5-7 |
| .github/workflows/devsecops-supply-chain.yml | Gates 8-9 |
| .github/workflows/devsecops-dast.yml | Gate 10 |
| .github/workflows/devsecops-policy-vault.yml | Gates 11-12 |

## Points

> "Every commit to CRMS runs through 12 automated security gates.
> We catch secrets, Dockerfile issues, IaC misconfigs, Python and
> TypeScript vulnerabilities, dependency CVEs, generate an SBOM,
> run DAST against the live app, validate K8s policy compliance,
> and check for hardcoded secrets - all before any code reaches
> production. The pipeline caught a real CRITICAL JWT CVE and a
> missing Kubernetes liveness probe during development."