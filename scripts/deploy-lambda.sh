#!/bin/bash

# Deploy Lambda Function Script
# This script packages and deploys the Lambda function to AWS

set -e

echo "=== Weather Dashboard Lambda Deployment ==="

# Configuration
FUNCTION_NAME="weather-dashboard-function"
LAMBDA_DIR="../lambda"
BUILD_DIR="./build"
ZIP_FILE="lambda-function.zip"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "Error: AWS CLI is not installed"
    exit 1
fi

# Create build directory
echo "Creating build directory..."
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy Lambda code
echo "Copying Lambda code..."
cp -r $LAMBDA_DIR/* $BUILD_DIR/

# Install dependencies
echo "Installing dependencies..."
cd $BUILD_DIR
npm install --production
cd ..

# Create ZIP file
echo "Creating deployment package..."
cd $BUILD_DIR
zip -r ../$ZIP_FILE . -x "*.test.js" "jest.config.js"
cd ..

# Update Lambda function
echo "Updating Lambda function..."
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://$ZIP_FILE

echo "Waiting for function update to complete..."
aws lambda wait function-updated \
    --function-name $FUNCTION_NAME

# Clean up
echo "Cleaning up..."
rm -rf $BUILD_DIR
rm $ZIP_FILE

echo "=== Lambda deployment complete! ==="
