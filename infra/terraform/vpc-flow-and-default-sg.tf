# ============================================
# VPC Flow Logs — CKV2_AWS_11
# ============================================
resource "aws_flow_log" "crms" {
  vpc_id          = aws_vpc.crms.id
  traffic_type    = "ALL"
  iam_role_arn    = aws_iam_role.flow_log.arn
  log_destination = aws_cloudwatch_log_group.flow_log.arn

  tags = {
    Name = "${var.project_name}-${var.environment}-flow-log"
  }
}

# KMS key for VPC flow log encryption — CKV_AWS_158
resource "aws_kms_key" "flow_log" {
  description             = "KMS key for ${var.project_name}-${var.environment} VPC flow log encryption"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  tags = {
    Name = "${var.project_name}-${var.environment}-flow-log-kms"
  }
}

resource "aws_kms_alias" "flow_log" {
  name          = "alias/${var.project_name}-${var.environment}-flow-log"
  target_key_id = aws_kms_key.flow_log.key_id
}

resource "aws_cloudwatch_log_group" "flow_log" {
  name              = "/aws/vpc/crms-${var.environment}-flow-logs"
  retention_in_days = 365 # CKV_AWS_338 — retain at least 1 year
  kms_key_id        = aws_kms_key.flow_log.arn # CKV_AWS_158 — encrypt with KMS

  tags = {
    Name = "${var.project_name}-${var.environment}-flow-log-group"
  }
}

resource "aws_iam_role" "flow_log" {
  name = "${var.project_name}-${var.environment}-flow-log-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "vpc-flow-logs.amazonaws.com"
      }
    }]
  })
}

# Scoped to the flow-log group's own ARN instead of "*" — CKV_AWS_290, CKV_AWS_355
resource "aws_iam_role_policy" "flow_log" {
  name = "${var.project_name}-${var.environment}-flow-log-policy"
  role = aws_iam_role.flow_log.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams"
      ]
      Effect   = "Allow"
      Resource = "${aws_cloudwatch_log_group.flow_log.arn}:*"
    }]
  })
}

# ============================================
# Default Security Group — CKV2_AWS_12
# Restrict all traffic on default SG
# ============================================
resource "aws_default_security_group" "crms_default" {
  vpc_id = aws_vpc.crms.id

  # No ingress rules — blocks all inbound
  # No egress rules — blocks all outbound
  # This satisfies CKV2_AWS_12

  tags = {
    Name = "${var.project_name}-${var.environment}-default-sg-restricted"
  }
}
