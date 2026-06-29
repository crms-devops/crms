#!/bin/bash

set -e

echo "Adding Helm repos..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

echo "Creating monitoring namespace..."
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

echo "Installing kube-prometheus-stack..."
helm upgrade --install kube-prometheus-stack \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --values observability/prometheus-values.yaml \
  --wait \
  --timeout 5m

echo "Applying PrometheusRules..."
kubectl apply -f observability/prometheus-rules.yaml

echo "Done! Access Grafana:"
echo "kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3000:80"
echo "Username: admin"
echo "Password: crms-grafana-admin"