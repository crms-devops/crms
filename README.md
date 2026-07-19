# crms

## The Problem
College result portals crash every result day when 5000+ students hit them simultaneously.

## Our Solution
A production grade open-source system built to handle 5000+ concurrent users with:
- FastAPI backend with async support
- Redis caching layer(1 DB query serves thousands)
- Kubernetes auto-scaling(pods scale with traffic)
- Full observability(Prometheus + Grafana)
- AWS cloud support

Leveraging K8s auto-scaling, redis caching, AWS infrastructure, automated security scanning, CI/CD and real-time observability, CRMS is highly available during result-day traffic.

<div align="center">

<img src="assets/crms_request_flow.png" alt="crms_request_flow" width="600"/>

</div>

The design is open-source any institution can deploy CRMS based on there requirements and configure it for their own semester structure, regulations, and branding.
