# Week 7 Notes — S3 Remote Backend for Terraform State

## What we built
- S3 bucket: crms-terraform-state-055237683990
- Versioning enabled — full state history preserved
- AES256 encryption — state files encrypted at rest
- Public access blocked — no accidental exposure
- main.tf updated with backend "s3" block

## Why remote state matters
Without S3 backend, terraform.tfstate lives on your laptop.
If laptop dies or two engineers run terraform simultaneously — state corrupts.
S3 backend: state is shared, versioned, encrypted, team-accessible.

## Commands used
```bash
aws s3api create-bucket --bucket crms-terraform-state-055237683990 --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1
aws s3api put-bucket-versioning --bucket crms-terraform-state-055237683990 --versioning-configuration Status=Enabled
terraform init -migrate-state   # migrates local state to S3
aws s3 ls s3://crms-terraform-state-055237683990/dev/
```

## Milestone
terraform.tfstate in S3 — team can now collaborate on infra safely
State never stored in Git — .gitignore covers *.tfstate

## What we learned
- Why .gitignore must exclude .terraform/, *.tfstate, *.tfstate.backup
- How terraform backend migration works
- Remote state enables team collaboration on infrastructure