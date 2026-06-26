# Week 10 — ArgoCD GitOps Setup

## What ArgoCD does
ArgoCD watches your GitHub repo. When anything in k8s/base/ changes,
it automatically applies those changes to the EKS cluster.
No more manual kubectl apply.

## To Install ArgoCD 
winget install -e --id argoproj.argocd

The official Argo CD CLI documentation also lists WinGet as a supported installation method.

## I got this!!
PS C:\Projects\crms> argocd version --client
argocd: v3.4.4+443415b
  BuildDate: 2026-06-18T09:15:00Z
  GitCommit: 443415b5527ac55366e0760c93ef0e1abd0cf273
  GitTreeState: clean
  GoVersion: go1.26.0
  Compiler: gc
  Platform: windows/amd64

## Install ArgoCD on cluster
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

## Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

## Get initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

## Deploy CRMS Application
kubectl apply -f k8s/argocd/crms-application.yaml

## GitOps flow after setup
1. Developer pushes code to GitHub
2. GitHub Actions builds new Docker image, pushes to GHCR
3. GitHub Actions updates image tag in k8s/base/backend-deployment.yaml
4. ArgoCD detects change in Git
5. ArgoCD automatically syncs to EKS cluster
6. New pods roll out with zero downtime