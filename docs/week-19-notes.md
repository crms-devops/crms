# Week 19 Notes — DevSecOps Supply Chain Gates 8-9

## What we built
Two gates focused on the software supply chain — the third-party
packages and libraries that CRMS depends on.

## File created
- .github/workflows/devsecops-supply-chain.yml

## Why supply chain security matters
The SolarWinds attack (2020) and Log4Shell (2021) showed that
attackers target the libraries you import, not just your code.
Your application is only as secure as its dependencies.

## Gates implemented

### Gate 8: Snyk — Dependency CVE Scanning
Scans backend/requirements.txt and frontend/package.json for
known CVEs (Common Vulnerabilities and Exposures).

What it does:
- Checks every package version against Snyk's vulnerability database
- Identifies transitive dependencies (dependencies of dependencies)
- Shows upgrade paths to fix vulnerabilities
- snyk monitor tracks dependencies over time and alerts on new CVEs

Severity threshold: HIGH — blocks if any HIGH or CRITICAL CVEs found.

Relevance to CRMS: This is where CVE-2024-33663 in python-jose 3.3.0
would have been caught at the dependency level (Trivy caught it at
the container level in Week 5 — now we catch it earlier).

### Gate 9: Syft — SBOM Generation
SBOM = Software Bill of Materials.
A complete list of every package inside a Docker image.

Syft generates SBOMs in two industry-standard formats:
- SPDX JSON (Linux Foundation standard)
- CycloneDX JSON (OWASP standard)

What goes into a backend SBOM example:
- Python 3.13.x
- FastAPI 0.115.12
- SQLAlchemy 2.0.41
- psycopg2-binary 2.9.10
- uvicorn 0.34.3
- ... (every package, every version)

Why SBOMs matter:
- US Executive Order 14028 (2021) requires SBOMs for federal software
- When a new CVE is discovered, you can instantly check if you're affected
- Compliance requirements (SOC2, ISO 27001) increasingly require SBOMs
- Retained as compliance artifacts (90 days in our pipeline)

## What we learned
- Supply chain attacks are now more common than direct code attacks
- Every npm install or pip install is a trust decision
- SBOMs are becoming a legal requirement in many industries
- Snyk monitor gives continuous visibility, not just point-in-time scans

## Interview answer
"Gate 9 generates a complete SBOM for every Docker image we build.
When Log4Shell was discovered, teams with SBOMs knew within minutes
whether they were affected. Teams without them spent days manually
checking. We generate SBOMs in both SPDX and CycloneDX formats and
store them as 90-day retention artifacts for compliance."

## Next week (Week 20)
OWASP ZAP DAST — the most impressive gate. It actually runs
the application and attacks it like a real hacker would.