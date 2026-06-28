# Week 8 Notes — EKS Cluster on AWS

## What we built
- infra/terraform/eks.tf: EKS cluster + node group
- aws_iam_role.eks_cluster: control plane IAM role
- aws_iam_role.eks_nodes: worker node IAM role
- 4 IAM policy attachments: EKSClusterPolicy, WorkerNode, CNI, ECR
- EKS cluster: crms-dev, Kubernetes 1.31, ap-south-1
- Node group: t3.small x1 (min 1, max 2) — cost optimised

## Cost awareness
- EKS control plane: $0.10/hour
- t3.small node: $0.023/hour
- Total: ~$0.123/hour
- Always terraform destroy after testing

## Commands used
```bash
terraform apply -auto-approve          # creates cluster in ~10 mins
aws eks update-kubeconfig --name crms-dev --region ap-south-1
kubectl get nodes                       # verify worker node READY
kubectl get namespaces                  # default, kube-system, kube-public
kubectl cluster-info                    # control plane endpoint
terraform destroy -auto-approve        # destroy after testing
```

## Milestone
kubectl get nodes output:
ip-10-0-x-x.ap-south-1.compute.internal   Ready   v1.31.14-eks-3385e9b

## What we learned
- How EKS control plane + worker nodes relate
- Why IAM roles are required for both control plane and nodes
- t3.small vs t3.medium trade-offs for cost vs capacity
- aws eks update-kubeconfig wires kubectl to the cluster