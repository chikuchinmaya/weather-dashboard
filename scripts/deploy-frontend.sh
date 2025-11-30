#!/bin/bash

# Deploy Frontend to S3 Script
# This script uploads frontend files to S3 bucket

set -e

echo "=== Weather Dashboard Frontend Deployment ==="

# Configuration
BUCKET_NAME="your-bucket-name"  # Update this with your S3 bucket name
FRONTEND_DIR="../frontend"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    exit 1
fi

# Check if bucket name is set
if [ "$BUCKET_NAME" = "your-bucket-name" ]; then
    echo "Error: Please update BUCKET_NAME in the script"
    exit 1
fi

# Upload files to S3
echo "Uploading frontend files to S3..."
aws s3 sync $FRONTEND_DIR s3://$BUCKET_NAME/ \
    --exclude "*.md" \
    --exclude ".DS_Store" \
    --delete

# Set content types
echo "Setting content types..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --content-type "text/html" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/styles.css s3://$BUCKET_NAME/styles.css \
    --content-type "text/css" \
    --metadata-directive REPLACE

aws s3 cp s3://$BUCKET_NAME/app.js s3://$BUCKET_NAME/app.js \
    --content-type "application/javascript" \
    --metadata-directive REPLACE

echo "=== Frontend deployment complete! ==="
echo "Website URL: http://$BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"
