# crms

## The Problem
College result portals crash every result day when 5000+ students hit them simultaneously.

## Our Solution
A production grade open-source system built to handle 5000 concurrent users with:
- FastAPI backend with async support
- Redis caching layer(1 DB query serves thousands)
- Kubernetes auto-scaling(pods scale with traffic)
- Full observability(Prometheus + Grafana)
- AWS cloud support

## Advantage
The design is open-source and college-agnostic, any institution can deploy CRMS and configure it for their own semester structure, regulations, and branding.
