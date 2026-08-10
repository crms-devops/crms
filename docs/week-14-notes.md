# Week 14 Notes — Multi-Environment Strategy (We actually skipped this for now)

## Decision: Week 14 skipped as planned

Week 14 was originally planned as:
- Terraform workspaces for dev/staging/prod environments
- ArgoCD app-of-apps pattern for multi-environment GitOps
- Separate Kubernetes namespaces per environment

## Why we skipped it

This was a deliberate decision made after Week 13, discussed with
our DevOps Engineers. The reasoning:

1. **Impact vs time**: Multi-environment Terraform workspaces are
   useful infrastructure knowledge but don't change what recruiters
   or the college sees in a demo. The visible impact is low.

2. **Higher priority**: Weeks 15 and 16 (SIET frontend branding and
   project polish) directly enable the college proposal and make the
   portfolio visually impressive. These had higher ROI for our goal.

3. **Already demonstrated**: The core multi-environment concept is
   already present in our Terraform code — the `environment` variable
   in `terraform.tfvars` and the `environments/` folder structure in
   `infra/terraform/` shows we understand the pattern.

4. **Time constraint**: With the 2027 MNC placement target, we needed
   to complete the visible deliverables (live portal, college proposal)
   before adding more infrastructure complexity.

## What multi-environment would have included

For completeness, here is what Week 14 would have built:

### Terraform workspaces
```bash
terraform workspace new staging
terraform workspace new prod
terraform workspace select dev
terraform apply  # creates dev VPC, EKS, RDS
terraform workspace select staging
terraform apply  # creates staging VPC, EKS, RDS (separate)
```

### Environment-specific tfvars

infra/terraform/environments/
├── dev/
│ └── terraform.tfvars # t3.small, 1 node, no NAT gateway
├── staging/
│ └── terraform.tfvars # t3.medium, 2 nodes, with NAT gateway
└── prod/
└── terraform.tfvars # t3.large, 3-10 nodes, multi-AZ RDS


### ArgoCD app-of-apps
```yaml
# One parent ArgoCD Application that manages:
# - crms-dev (namespace: crms-dev)
# - crms-staging (namespace: crms-staging)
# - crms-prod (namespace: crms-prod)
```

### Environment promotion flow

Feature branch → develop → staging (auto) → prod (manual approval)


## What this demonstrates

Even without building it, understanding the pattern and being able
to explain why you chose not to build it is itself a senior
engineering skill, prioritisation and trade-off analysis.

"We scoped Week 14 (multi-environment Terraform workspaces) out of
Phase 1 because it had lower visible impact than completing the
college portal demo and project documentation. The environment
variable structure is already in our Terraform code. In Phase 2
DevSecOps integration, we'll implement full dev/staging/prod
pipelines as part of the 19-gate security pipeline."
