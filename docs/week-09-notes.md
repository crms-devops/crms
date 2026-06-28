# Week 9 Notes — CRMS Deployed on Kubernetes

## What we built
- k8s/base/namespace.yaml: crms namespace
- k8s/base/configmap.yaml: non-secret app config
- k8s/base/secret.yaml: DATABASE_URL + SECRET_KEY
- k8s/base/postgres-deployment.yaml: PostgreSQL + ClusterIP service
- k8s/base/backend-deployment.yaml: FastAPI x2 replicas + health probes
- k8s/base/frontend-deployment.yaml: React/nginx x2 + LoadBalancer service
- k8s/base/hpa.yaml: HPA backend 2-10 pods, frontend 2-5 pods

## Critical fix applied
nginx upstream was "backend" — EKS has no DNS for that.
Fixed to: crms-backend-service.crms.svc.cluster.local:8000
Full Kubernetes DNS format: <service>.<namespace>.svc.cluster.local

## Commands used
```bash
kubectl apply -f k8s/base/namespace.yaml   # always apply namespace first
kubectl apply -f k8s/base/
kubectl get pods -n crms -w
kubectl get service crms-frontend-service -n crms
kubectl logs <pod-name> -n crms            # debug crashes
kubectl describe pod <pod-name> -n crms    # diagnose pending/error
```

## Milestone
All 5 pods 1/1 Running:
- crms-backend x2
- crms-frontend x2
- crms-db x1

LoadBalancer URL live:
ade5ebcd818514ed69e44386d4b3ca72.elb.ap-south-1.amazonaws.com

## What we learned
- Kubernetes DNS: services reachable by full DNS name within cluster
- Namespace ordering matters: apply namespace before other resources
- HPA scales pods based on CPU/memory — works with Kubernetes metrics server
- LoadBalancer type service = AWS NLB provisioned automatically
- imagePullPolicy: Always ensures latest image is pulled from GHCR

## Issues and fixes
- CrashLoopBackOff: nginx couldn't resolve "backend" hostname
  Fix: use full K8s DNS crms-backend-service.crms.svc.cluster.local
- Namespace not found on first apply: applied namespace.yaml separately first
- GHCR images must be public for EKS to pull without auth