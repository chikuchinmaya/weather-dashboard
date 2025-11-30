# Deployment Guide

This guide provides step-by-step instructions for deploying the Weather Dashboard to AWS.

## Prerequisites Checklist

- [ ] AWS Account created
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] OpenWeatherMap API key obtained
- [ ] Node.js 18.x or later installed
- [ ] Bash shell available (Linux/Mac/WSL)

## Deployment Steps

### Step 1: Prepare Your Environment

1. Clone or download the project
2. Navigate to the project directory
3. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### Step 2: Deploy AWS Infrastructure

Run the infrastructure deployment script:

```bash
cd scripts
chmod +x deploy-infrastructure.sh
./deploy-infrastructure.sh
```

**What this does:**
- Creates Lambda function with Node.js 18.x runtime
- Sets up IAM role with CloudWatch Logs permissions
- Creates API Gateway with /weather and /forecast endpoints
- Configures CORS for cross-origin requests
- Creates S3 bucket for static website hosting
- Enables S3 static website hosting

**You will be prompted for:**
- OpenWeatherMap API Key
- Unique S3 bucket name (must be globally unique)

**Expected output:**
```
API Gateway URL: https://abc123.execute-api.us-east-1.amazonaws.com/prod
S3 Website URL: http://your-bucket.s3-website-us-east-1.amazonaws.com
```

**Save these URLs** - you'll need them in the next steps.

### Step 3: Update Frontend Configuration

Edit `frontend/app.js` and update the API Gateway URL:

```javascript
// Line 4
const API_GATEWAY_URL = 'https://abc123.execute-api.us-east-1.amazonaws.com/prod';
```

Replace with your actual API Gateway URL from Step 2.

### Step 4: Deploy Lambda Function Code

Package and deploy the Lambda function:

```bash
cd scripts
chmod +x deploy-lambda.sh
./deploy-lambda.sh
```

**What this does:**
- Installs Lambda dependencies (axios)
- Creates deployment package (ZIP file)
- Uploads code to Lambda function
- Waits for deployment to complete

**Expected output:**
```
=== Lambda deployment complete! ===
```

### Step 5: Deploy Frontend Files

Update the bucket name in `scripts/deploy-frontend.sh`:

```bash
# Line 8
BUCKET_NAME="your-actual-bucket-name"
```

Then deploy:

```bash
cd scripts
chmod +x deploy-frontend.sh
./deploy-frontend.sh
```

**What this does:**
- Uploads HTML, CSS, and JS files to S3
- Sets correct content-type headers
- Enables public read access

**Expected output:**
```
Website URL: http://your-bucket.s3-website-us-east-1.amazonaws.com
```

### Step 6: Test Your Deployment

1. Open the S3 Website URL in your browser
2. Enter a city name (e.g., "London")
3. Click "Get Weather"
4. Verify that current weather and forecast display correctly

### Step 7: (Optional) Set Up CloudFront CDN

For faster global access, deploy CloudFront:

```bash
aws cloudformation deploy \
    --stack-name weather-dashboard-cloudfront \
    --template-file ../infrastructure/cloudfront-template.yaml \
    --parameter-overrides \
        S3BucketWebsiteURL=your-bucket.s3-website-us-east-1.amazonaws.com \
        ProjectName=weather-dashboard
```

**Note:** Remove `http://` from the S3 URL when passing as parameter.

Get CloudFront URL:

```bash
aws cloudformation describe-stacks \
    --stack-name weather-dashboard-cloudfront \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontURL`].OutputValue' \
    --output text
```

**CloudFront deployment takes 15-20 minutes** to propagate globally.

### Step 8: (Optional) Set Up Monitoring

Deploy CloudWatch alarms and dashboard:

```bash
aws cloudformation deploy \
    --stack-name weather-dashboard-monitoring \
    --template-file ../infrastructure/monitoring-template.yaml \
    --parameter-overrides \
        LambdaFunctionName=weather-dashboard-function \
        ApiGatewayName=weather-dashboard-api \
        AlarmEmail=your-email@example.com \
        ProjectName=weather-dashboard
```

**Confirm SNS subscription** by clicking the link in the email you receive.

## Updating Your Deployment

### Update Lambda Function

After making changes to Lambda code:

```bash
cd scripts
./deploy-lambda.sh
```

### Update Frontend

After making changes to frontend files:

```bash
cd scripts
./deploy-frontend.sh
```

If using CloudFront, invalidate the cache:

```bash
# Update DISTRIBUTION_ID in the script first
./invalidate-cloudfront.sh
```

### Update Infrastructure

After modifying CloudFormation templates:

```bash
aws cloudformation deploy \
    --stack-name weather-dashboard-stack \
    --template-file ../infrastructure/cloudformation-template.yaml \
    --parameter-overrides \
        OpenWeatherApiKey=your-api-key \
        ProjectName=weather-dashboard \
    --capabilities CAPABILITY_NAMED_IAM
```

## Verification Checklist

After deployment, verify:

- [ ] Lambda function exists and has correct environment variables
- [ ] API Gateway endpoints return valid responses
- [ ] S3 bucket is publicly accessible
- [ ] Frontend loads without errors
- [ ] Weather search returns data
- [ ] Forecast displays correctly
- [ ] CloudWatch logs are being written
- [ ] (Optional) CloudFront distribution is active

## Testing API Endpoints

### Test Weather Endpoint

```bash
curl "https://your-api-gateway-url/prod/weather?city=London"
```

Expected response:
```json
{
  "city": "London",
  "temperature": 285.15,
  "humidity": 75,
  "windSpeed": 5.5,
  "description": "clear sky",
  "timestamp": 1234567890
}
```

### Test Forecast Endpoint

```bash
curl "https://your-api-gateway-url/prod/forecast?city=London"
```

Expected response:
```json
{
  "city": "London",
  "forecast": [...]
}
```

## Troubleshooting

### Lambda Deployment Fails

**Error:** "Function not found"

**Solution:** Deploy infrastructure first using `deploy-infrastructure.sh`

### Frontend Shows CORS Error

**Error:** "Access to fetch blocked by CORS policy"

**Solution:** 
1. Verify API Gateway has CORS enabled
2. Check Lambda returns correct CORS headers
3. Redeploy API Gateway stage

### S3 Website Returns 403

**Error:** "Access Denied"

**Solution:**
1. Check bucket policy allows public read
2. Verify static website hosting is enabled
3. Ensure files have correct permissions

### API Returns 500 Error

**Error:** "Internal server error"

**Solution:**
1. Check CloudWatch Logs: `aws logs tail /aws/lambda/weather-dashboard-function --follow`
2. Verify OpenWeatherMap API key is valid
3. Check Lambda has internet access

### City Not Found Error

**Error:** "City not found"

**Solution:**
1. Verify city name spelling
2. Try variations (e.g., "New York" vs "New York City")
3. Check OpenWeatherMap API is accessible

## Rollback Procedure

If deployment fails or causes issues:

### Rollback Lambda

```bash
aws lambda update-function-code \
    --function-name weather-dashboard-function \
    --s3-bucket your-backup-bucket \
    --s3-key previous-version.zip
```

### Rollback Frontend

```bash
aws s3 sync ./backup-frontend/ s3://your-bucket/ --delete
```

### Rollback Infrastructure

```bash
aws cloudformation update-stack \
    --stack-name weather-dashboard-stack \
    --use-previous-template
```

## Clean Up / Uninstall

To remove all resources:

```bash
# Delete S3 bucket contents
aws s3 rm s3://your-bucket --recursive

# Delete CloudFormation stacks
aws cloudformation delete-stack --stack-name weather-dashboard-monitoring
aws cloudformation delete-stack --stack-name weather-dashboard-cloudfront
aws cloudformation delete-stack --stack-name weather-dashboard-s3-stack
aws cloudformation delete-stack --stack-name weather-dashboard-stack

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name weather-dashboard-stack
```

## Cost Optimization Tips

1. **Use CloudFront** to reduce S3 data transfer costs
2. **Set CloudWatch log retention** to 7 days
3. **Enable S3 lifecycle policies** to delete old versions
4. **Monitor Lambda duration** and optimize code
5. **Use API Gateway caching** for frequently requested cities
6. **Set up AWS Budgets** to track spending

## Security Best Practices

1. **Rotate API keys** regularly
2. **Enable CloudTrail** for audit logging
3. **Use AWS Secrets Manager** for sensitive data
4. **Restrict S3 bucket policy** to specific origins
5. **Enable AWS WAF** on API Gateway (optional)
6. **Review IAM policies** quarterly

## Support

For deployment issues:
1. Check CloudWatch Logs
2. Review CloudFormation events
3. Verify AWS CLI configuration
4. Test API endpoints directly
5. Check OpenWeatherMap API status

## Next Steps

After successful deployment:
1. Set up custom domain name
2. Configure SSL certificate
3. Enable API Gateway caching
4. Set up automated backups
5. Implement CI/CD pipeline
6. Add monitoring dashboards
