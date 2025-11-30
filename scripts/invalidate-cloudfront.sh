#!/bin/bash

# Invalidate CloudFront Cache Script
# This script invalidates CloudFront cache after frontend updates

set -e

echo "=== CloudFront Cache Invalidation ==="

# Configuration
DISTRIBUTION_ID=""  # Update this with your CloudFront distribution ID

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    exit 1
fi

# Check if distribution ID is set
if [ -z "$DISTRIBUTION_ID" ]; then
    echo "Error: Please set DISTRIBUTION_ID in the script"
    exit 1
fi

# Create invalidation
echo "Creating invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "Invalidation created: $INVALIDATION_ID"
echo "Waiting for invalidation to complete..."

aws cloudfront wait invalidation-completed \
    --distribution-id $DISTRIBUTION_ID \
    --id $INVALIDATION_ID

echo "=== CloudFront cache invalidation complete! ==="
