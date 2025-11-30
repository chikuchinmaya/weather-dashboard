# Quick Start Guide

Get your Weather Dashboard up and running in 5 minutes!

## Prerequisites

- AWS Account
- AWS CLI configured (`aws configure`)
- OpenWeatherMap API Key ([Get one free](https://openweathermap.org/api))

## 5-Minute Deployment

### 1. Deploy Infrastructure (2 minutes)

```bash
cd scripts
chmod +x *.sh
./deploy-infrastructure.sh
```

Enter your:
- OpenWeatherMap API Key
- Unique S3 bucket name

**Save the output URLs!**

### 2. Update Frontend Config (30 seconds)

Edit `frontend/app.js` line 4:

```javascript
const API_GATEWAY_URL = 'YOUR_API_GATEWAY_URL_HERE';
```

### 3. Deploy Lambda (1 minute)

```bash
./deploy-lambda.sh
```

### 4. Deploy Frontend (1 minute)

Edit `scripts/deploy-frontend.sh` line 8 with your bucket name, then:

```bash
./deploy-frontend.sh
```

### 5. Test It! (30 seconds)

Open the S3 Website URL in your browser and search for a city!

## That's It!

Your Weather Dashboard is now live! 🎉

## Troubleshooting

**Problem**: API returns errors
**Solution**: Check CloudWatch Logs
```bash
aws logs tail /aws/lambda/weather-dashboard-function --follow
```

**Problem**: Frontend shows CORS error
**Solution**: Verify API Gateway URL in `frontend/app.js`

**Problem**: City not found
**Solution**: Try different city name variations

## Next Steps

- Read [README.md](README.md) for full documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project overview

## Need Help?

1. Check CloudWatch Logs
2. Verify AWS CLI configuration
3. Test API endpoints with curl
4. Review CloudFormation stack events

## Clean Up

To remove all resources:

```bash
aws s3 rm s3://your-bucket --recursive
aws cloudformation delete-stack --stack-name weather-dashboard-s3-stack
aws cloudformation delete-stack --stack-name weather-dashboard-stack
```

---

**Happy Weather Tracking! ☀️🌧️⛈️**
