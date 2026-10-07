# Week 18 Notes — DevSecOps SAST Gates 5-7

## What we built
Three static analysis gates that scan the application source code
for security vulnerabilities and code quality issues.

## File created
- .github/workflows/devsecops-sast.yml
- sonar-project.properties

## Gates implemented

### Gate 5: Bandit — Python SAST
Scans backend/app/ for Python security vulnerabilities.
Severity levels: LOW, MEDIUM, HIGH, CRITICAL.
Pipeline blocks on HIGH severity findings.

What Bandit catches:
- SQL injection via string formatting (use parameterised queries)
- Hardcoded passwords and secrets
- Use of weak cryptographic functions (MD5, SHA1)
- Subprocess calls with shell=True
- Use of assert statements in production code
- Insecure use of yaml.load (use yaml.safe_load)
- Binding to 0.0.0.0 without restriction

Findings in CRMS backend: 0 HIGH severity — our FastAPI
code uses SQLAlchemy ORM (parameterised by default),
python-jose for JWT (no weak crypto), and no subprocess calls.

### Gate 6: ESLint Security Plugin
Adds eslint-plugin-security and eslint-plugin-no-unsanitized
to the existing ESLint setup.

What it catches:
- detect-unsafe-regex: ReDoS (regex denial of service)
- detect-object-injection: prototype pollution
- no-unsanitized/method: XSS via innerHTML/outerHTML
- no-unsanitized/property: DOM-based XSS

Findings in CRMS frontend: 0 errors — our React components
use JSX rendering (not innerHTML) and no user input is
passed directly to DOM APIs.

### Gate 7: SonarQube — Quality Gate
SonarCloud integration (free for public repositories).
Runs pytest with --cov to generate coverage.xml.
Sends results to sonarcloud.io for analysis.

Metrics tracked:
- Code coverage percentage
- Code smells (maintainability issues)
- Technical debt (estimated fix time)
- Security hotspots
- Duplicated code blocks
- Bugs and vulnerabilities

Setup required:
1. sonarcloud.io → sign in with GitHub
2. Create organization: crms-devops
3. Create project: crms-devops_crms
4. Generate token → add SONAR_TOKEN to GitHub secrets
5. Add SONAR_HOST_URL = https://sonarcloud.io to GitHub secrets
6. sonar-project.properties in repo root

Result: Quality Gate PASSED — 0 new issues, 0 security hotspots.

## sonar-project.properties
```properties
sonar.projectKey=crms-devops_crms
sonar.organization=crms-devops
sonar.projectName=CRMS
sonar.sources=backend/app,frontend/src
sonar.python.coverage.reportPaths=backend/coverage.xml
sonar.python.version=3.13
sonar.exclusions=**/node_modules/**,**/__pycache__/**,**/migrations/**
```

## What we learned
- SAST catches vulnerabilities before the code runs — cheaper to fix early
- SQLAlchemy ORM is inherently safer than raw SQL string formatting
- React JSX rendering escapes HTML by default — built-in XSS protection
- SonarCloud is free for public repos and takes 10 minutes to set up
- Coverage reporting requires running tests with pytest-cov first

## Difference between SAST and DAST
SAST (Static): analyses source code without running it — fast, runs in CI
DAST (Dynamic): attacks the running application — slower, finds runtime issues
Both are needed — SAST catches code issues, DAST catches deployment issues.

## Interview answer
"Bandit gave us confidence that our FastAPI code has no SQL injection
or weak cryptography. ESLint security confirmed no XSS vectors in
our React frontend. SonarQube passed with zero new issues. Together
these three gates mean every pull request is reviewed by three
independent security analyzers before a human ever looks at it."

## Next week (Week 19)
Supply chain security — scanning the dependencies we import,
not just the code we write.