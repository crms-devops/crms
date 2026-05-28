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
