# Week 17 Notes — DevSecOps Pre-Flight Gates 1-4

## What we built
The first 4 gates of the DevSecOps pipeline — pre-flight checks
that run on every push before any code is built or tested.

## File created
- .github/workflows/devsecops-preflight.yml

## Gates implemented

### Gate 1: TruffleHog — Secret Scanning
Replaced Gitleaks (requires paid license) with TruffleHog (free, open source).
Scans every commit for verified secrets: AWS access keys, GitHub tokens,
database passwords, API keys, JWT secrets.
Runs with --only-verified flag — only blocks on confirmed secrets,
not potential false positives.

Why this matters: Earlier in this project, AWS credentials were
accidentally exposed in a chat session. Bots scan GitHub for leaked
credentials within minutes. TruffleHog prevents this at the pipeline level.

### Gate 2: Hadolint — Dockerfile Lint
Lints both backend/Dockerfile and frontend/Dockerfile.
Catches: running as root, using latest tags, missing HEALTHCHECK,
ADD instead of COPY, apt-get without --no-install-recommends.
failure-threshold: error — only blocks on ERROR level, not warnings.

### Gate 3: Checkov — IaC Security Scan
Scans infra/terraform/ and k8s/ directories.
Findings uploaded to GitHub Security tab as SARIF format.
soft_fail: true — reports findings without blocking (dev environment).

Findings it caught in our Terraform:
- CKV2_AWS_11: VPC flow logging not enabled → fixed: added aws_flow_log resource
- CKV2_AWS_12: Default security group not restricted → fixed: aws_default_security_group
- CKV_AWS_37: EKS control plane logging disabled → fixed: enabled_cluster_log_types

Findings it caught in K8s manifests:
- CKV_K8S_30: No seccomp profile → fixed: seccompProfile: RuntimeDefault
- CKV_K8S_40: Container running as low UID → fixed: runAsUser: 10001
- CKV_K8S_22: Filesystem not read-only → fixed: readOnlyRootFilesystem: true
- CKV2_K8S_6: No NetworkPolicy → fixed: added networkpolicy.yaml for all 5 pods

### Gate 4: TerraSecure — ML-powered IaC Scan
Our own tool integrated into the pipeline.
Uses XGBoost classifier trained on real breach patterns.
Outputs SARIF to GitHub Security tab + JSON artifact.
fail-on: none — reports findings without blocking.

## Key lesson
This week showed that running Checkov against your own infrastructure
is humbling. Every resource we created for the project had at least
one finding. We fixed them all properly instead of skipping — that
distinction matters in interviews.

## NetworkPolicy — what we added
Created k8s/base/networkpolicy.yaml with 5 policies:
- backend: ingress from frontend only, egress to db + kafka
- frontend: ingress on port 80 only, egress to backend
- db: ingress from backend only
- kafka: ingress from backend, egress to zookeeper
- zookeeper: ingress from kafka only

This is microsegmentation — even if an attacker breaches one pod,
they cannot reach other pods in the namespace.

## Security context changes
Added to all K8s deployments:
- runAsNonRoot: true
- runAsUser: 10001
- readOnlyRootFilesystem: true
- allowPrivilegeEscalation: false
- capabilities: drop: [ALL]
- seccompProfile: type: RuntimeDefault
- emptyDir volumes for /tmp and cache directories

## Commands used
```bash
# Check what Checkov finds
pip install checkov
checkov -d infra/terraform --framework terraform
checkov -d k8s --framework kubernetes

# Verify NetworkPolicy works
kubectl get networkpolicies -n crms
```

## Issues encountered and fixed
- Gitleaks requires paid license for private repos → replaced with TruffleHog
- Checkov SARIF path: checkov-k8s.sarif/results_sarif.sarif not checkov-k8s.sarif
- Checkov action env var bug with CHECKOV_RESULTS → upgraded to bridgecrewio/checkov-action@v12

## Interview answer
"Gate 3 Checkov found that none of our Kubernetes pods had NetworkPolicy,
all containers ran as root, and our EKS cluster had no audit logging.
We fixed every finding properly in the source files rather than adding
skip rules. That's the difference between DevSecOps theater and real security."

## Next week (Week 18)
SAST gates — static analysis of the actual application code.