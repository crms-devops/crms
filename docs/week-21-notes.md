# Week 21 Notes — DevSecOps Policy + Vault Gates 11-12

## What we built
Policy as Code with OPA and secrets management validation.

## Files created
- .github/workflows/devsecops-policy-vault.yml
- policy/k8s-security.rego
- docs/decisions/vault-migration.md

## Gates implemented

### Gate 11: OPA — Open Policy Agent
OPA is the industry standard for Policy as Code.
Instead of manual code reviews checking "does this deployment
follow our security standards?", OPA automates it.

We wrote 4 Rego policies in policy/k8s-security.rego:

Policy 1: No root containers
```rego
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.securityContext.runAsNonRoot
  msg := sprintf("Container '%v' must set runAsNonRoot: true", [container.name])
}
```

Policy 2: All containers must have resource limits
Policy 3: No privilege escalation allowed
Policy 4: All containers must have liveness probes

Real finding: OPA caught that our Kafka and Zookeeper containers
had no liveness probes. Kubernetes cannot detect if these crash
without probes — it just sees the container "running" but serving
no traffic. We fixed this by adding health check commands:
- Kafka: kafka-broker-api-versions --bootstrap-server localhost:9092
- Zookeeper: echo ruok | nc localhost 2181 | grep imok

This is exactly the value of Gate 11 — it caught something
that Checkov missed and that a human reviewer might not notice.

### Gate 12: Vault Secrets Validation
Two parts:

Part 1: detect-secrets scan
Runs detect-secrets across the entire repository.
Catches: hardcoded API keys, database passwords, private keys,
AWS credentials, generic high-entropy strings.

Part 2: Vault migration plan validation
Checks that docs/decisions/vault-migration.md exists.
This documents our planned migration from K8s Secrets (base64 encoded)
to HashiCorp Vault with External Secrets Operator.

Why K8s Secrets are not enough for production:
- Base64 is not encryption — it is encoding
- Anyone with kubectl get secret can read them
- Secrets are not rotated automatically
- No audit log of who accessed which secret

HashiCorp Vault fixes all of this:
- Secrets are encrypted at rest (AES-256-GCM)
- Dynamic secrets: database credentials generated per-request
- Automatic rotation every 24 hours
- Full audit log of every secret access
- External Secrets Operator syncs Vault secrets into K8s

## Rego language
Rego is a declarative policy language designed for OPA.
It reads like a set of rules:
"deny this resource if condition X is true"
OPA evaluates every K8s manifest against every rule.
If any rule fires, the gate fails and the deployment is blocked.

## What we learned
- Policy as Code is the evolution of security checklists
- Without OPA, "no root containers" is a guideline. With OPA, it's enforced
- K8s Secrets are convenient but not production-secure
- Vault migration is a Phase 3 item — documented plan matters as much as implementation
- Liveness probes are critical — without them K8s cannot self-heal a crashed container

## Interview answer
"Gate 11 caught that our Kafka containers had no liveness probes —
meaning if Kafka crashed, Kubernetes would think it was still healthy
and never restart it. OPA caught what manual review missed.
Gate 12 validates we have a documented migration path from
Kubernetes Secrets to HashiCorp Vault for Phase 3."

## Next week (Week 22)
Full pipeline documentation, final tags, project complete.