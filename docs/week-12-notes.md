# Week 12 Notes — Kafka + KEDA + k6 Load Testing

## What we built

### Kafka — Async Result Notifications
- docker-compose.yml: Kafka + Zookeeper added
- backend/app/core/kafka.py: KafkaProducer with graceful fallback
  - Publishes to "result-published" topic when results uploaded
  - If Kafka unavailable: logs warning, continues without blocking
- backend/app/consumer.py: KafkaConsumer microservice
  - Consumes result-published topic
  - Sends notifications to students (email/SMS in production)
- kafka-python-ng==2.2.3 chosen over aiokafka (Python 3.13 compatible)

### KEDA — Event-Driven Autoscaling
- k8s/base/keda-scaledobject.yaml: ScaledObject targeting crms-backend
  - Trigger: Kafka consumer group lag on result-published topic
  - Min replicas: 2, Max replicas: 10
  - lagThreshold: 10 — scale up when 10+ messages queued
- k8s/base/kafka-deployment.yaml: Kafka + Zookeeper on EKS

### k6 Load Test Results
- Script: k6/load-test.js
- 100 concurrent virtual users
- 3 minute test duration
- Results:
  - Total requests: 24,841
  - Throughput: 137 requests/second
  - avg latency: 14.51ms
  - p99 latency: 58.94ms (threshold: <2000ms) 
  - Error rate: 0.00% (threshold: <10%) 
  - checks_succeeded: 100% (37,260/37,260) 

## Issues encountered and fixed
- aiokafka 0.11.0 requires gcc — not available in python:3.13-slim
  Fix: switched to kafka-python 2.0.2
- kafka-python 2.0.2 vendor.six broken on Python 3.13
  Fix: switched to kafka-python-ng 2.2.3 (maintained fork)
- k6 setup() timeout: login failing before test started
  Fix: added error logging + timeout to setup(), seeded Docker DB
- Kafka healthcheck causing docker-compose failure on Windows
  Fix: removed kafka healthcheck, backend depends only on db

## Architecture lesson
Without Kafka: Faculty uploads → student waits → notification sent synchronously
With Kafka: Faculty uploads → event published → student notified asynchronously
Result: Faculty upload is instant, notifications scale independently

## KEDA vs HPA
- HPA: scales on CPU/memory — reactive, lags behind traffic
- KEDA: scales on Kafka lag — proactive, scales before overload
- Zero messages = 0 consumer pods (cost saving)
- 1000 messages = 10 consumer pods (instant scale-up)

## Commands used
```bash
# Local testing
docker compose up -d
k6 run k6/load-test.js

# EKS deployment
helm repo add kedacore https://kedacore.github.io/charts
kubectl create namespace keda
helm install keda kedacore/keda --namespace keda
kubectl apply -f k8s/base/keda-scaledobject.yaml
```

## Next week (Week 13)
- Alembic database migrations
- Auto-create tables on application startup
- No more manual SQL scripts