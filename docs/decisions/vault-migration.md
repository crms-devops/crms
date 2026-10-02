# HashiCorp Vault Migration Plan

## Current state
Secrets stored as Kubernetes Secret manifests (base64 encoded).
Acceptable for dev - not for production.

## Target state
External Secrets Operator + HashiCorp Vault on EKS.

## Migration steps
1. Deploy Vault: helm install vault hashicorp/vault --namespace vault
2. Enable Kubernetes auth method in Vault
3. Store DATABASE_URL and SECRET_KEY in Vault KV store
4. Install External Secrets Operator
5. Create ExternalSecret CRD pointing to Vault paths
6. Remove k8s/base/secret.yaml
7. Vault auto-rotates secrets every 24h

## Timeline
Phase 3 - production hardening