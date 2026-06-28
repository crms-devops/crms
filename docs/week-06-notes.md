# Week 6 Notes — Terraform VPC Foundation

## What we built
- infra/terraform/main.tf: AWS provider ~> 5.0, ap-south-1 region
- infra/terraform/vpc.tf: VPC 10.0.0.0/16, IGW, public/private subnets, route tables
- infra/terraform/security_groups.tf: EKS nodes SG, RDS SG
- infra/terraform/variables.tf: VPC CIDR, subnets, AZs, environment
- infra/terraform/outputs.tf: vpc_id, subnet IDs
- infra/terraform/terraform.tfvars: dev environment, ap-south-1

## Key decisions
- NAT Gateway excluded from dev — saves $32/month
- All resources tagged: Project=CRMS, ManagedBy=Terraform
- ap-south-1 (Mumbai) — closest region to Coimbatore

## Commands used
```bash
terraform init
terraform plan       # always plan before apply
terraform apply      # creates 14 resources in ~30 seconds
terraform destroy    # tears down to $0 when not in use
```

## Milestone
crms-dev-vpc visible in AWS Console ap-south-1
14 resources created: VPC, IGW, 4 subnets, 2 route tables,
4 associations, 2 security groups

## What we learned
- How Terraform providers and resources work
- Why IaC matters: infrastructure is disposable, code is permanent
- How VPC subnets, route tables, and IGW connect together
- terraform plan shows exactly what will change before touching AWS