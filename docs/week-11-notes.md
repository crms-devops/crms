# Week 11 Notes — Prometheus + Grafana Observability

## What we built
- backend/app/main.py: prometheus-fastapi-instrumentator added
  - Exposes /metrics endpoint automatically
  - Tracks: request count, latency histograms, in-progress requests
- observability/prometheus-values.yaml: kube-prometheus-stack Helm values
  - Prometheus retention: 24h
  - Scrapes crms-backend:8000/metrics
  - Grafana enabled with admin password
- observability/grafana-dashboards/crms-dashboard.json:
  - Panel 1: API request rate (requests/sec)
  - Panel 2: p99 API response latency
  - Panel 3: Pod CPU usage by pod name
  - Panel 4: Pod memory usage by pod name
- observability/prometheus-rules.yaml: 3 alert rules
  - CRMSHighErrorRate: fires if 5xx rate > 10% for 2m
  - CRMSHighLatency: fires if p99 > 1s for 5m
  - CRMSPodDown: fires if backend replicas < 1

## Deploy monitoring stack
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
kubectl create namespace monitoring
helm upgrade --install kube-prometheus-stack \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values observability/prometheus-values.yaml
kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3000:80
```

## Access Grafana
URL: http://localhost:3000
Username: admin
Password: crms-grafana-admin

## Key metrics exposed by /metrics
- http_requests_total: total requests by method, path, status
- http_request_duration_seconds: latency histogram
- http_requests_inprogress: concurrent requests

## What we learned
- How Prometheus scrapes metrics via pull model
- PromQL: rate(), histogram_quantile(), kube_ metrics
- Grafana dashboards: panels, data sources, time ranges
- Alert rules: expr, for, severity, annotations
- Why observability matters: you can't fix what you can't measure

## Note on resources
kube-prometheus-stack requires t3.medium (4GB RAM) to run
alongside CRMS application pods. t3.small runs out of memory.
Production: use t3.medium or larger nodes.