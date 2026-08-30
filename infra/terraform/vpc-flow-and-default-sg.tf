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

resource "aws_cloudwatch_log_group" "flow_log" {
  name              = "/aws/vpc/crms-${var.environment}-flow-logs"
  retention_in_days = 7

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
      Resource = "*"
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