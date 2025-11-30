#!/bin/bash

# Deploy Infrastructure Script
# This script deploys the CloudFormation stacks

set -e

echo "=== Weather Dashboard Infrastructure Deployment ==="

# Configuration
STACK_NAME="weather-dashboard-stack"
S3_STACK_NAME="weather-dashboard-s3-stack"
TEMPLATE_FILE="../infrastructure/cloudformation-template.yaml"
S3_TEMPLATE_FILE="../infrastructure/s3-bucket-template.yaml"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    exit 1
fi

# Prompt for OpenWeatherMap API Key
read -sp "Enter your OpenWeatherMap API Key: " API_KEY
echo

if [ -z "$API_KEY" ]; then
    echo "Error: API Key is required"
    exit 1
fi

# Prompt for S3 bucket name
read -p "Enter a unique S3 bucket name: " BUCKET_NAME

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: Bucket name is required"
    exit 1
fi

# Deploy main infrastructure stack
echo "Deploying main infrastructure stack..."
aws cloudformation deploy \
    --stack-name $STACK_NAME \
    --template-file $TEMPLATE_FILE \
    --parameter-overrides \
        OpenWeatherApiKey=$API_KEY \
        ProjectName=weather-dashboard \
    --capabilities CAPABILITY_NAMED_IAM

# Get API Gateway URL
API_URL=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
    --output text)

echo "API Gateway URL: $API_URL"

# Deploy S3 bucket stack
echo "Deploying S3 bucket stack..."
aws cloudformation deploy \
    --stack-name $S3_STACK_NAME \
    --template-file $S3_TEMPLATE_FILE \
    --parameter-overrides \
        BucketName=$BUCKET_NAME \
        ProjectName=weather-dashboard

# Get S3 Website URL
WEBSITE_URL=$(aws cloudformation describe-stacks \
    --stack-name $S3_STACK_NAME \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
    --output text)

echo "=== Infrastructure deployment complete! ==="
echo "API Gateway URL: $API_URL"
echo "S3 Website URL: $WEBSITE_URL"
echo ""
echo "Next steps:"
echo "1. Update frontend/app.js with the API Gateway URL"
echo "2. Run deploy-frontend.sh to upload frontend files"
