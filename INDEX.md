# Weather Dashboard - Project Index

## 📚 Documentation

| Document | Description | When to Read |
|----------|-------------|--------------|
| [QUICKSTART.md](QUICKSTART.md) | 5-minute deployment guide | Start here! |
| [README.md](README.md) | Complete project documentation | For full understanding |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Detailed deployment instructions | Before deploying |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | Project overview and status | For project overview |

## 📁 Project Structure

### Frontend (`/frontend`)
- `index.html` - Main application page
- `styles.css` - Responsive styling
- `app.js` - JavaScript application logic
- `error.html` - Error page

### Backend (`/lambda`)
- `index.js` - Lambda function handler
- `package.json` - Node.js dependencies
- `jest.config.js` - Test configuration

### Infrastructure (`/infrastructure`)
- `cloudformation-template.yaml` - Main infrastructure
- `s3-bucket-template.yaml` - S3 static hosting
- `cloudfront-template.yaml` - CDN (optional)
- `monitoring-template.yaml` - CloudWatch monitoring

### Scripts (`/scripts`)
- `deploy-infrastructure.sh` - Deploy AWS resources
- `deploy-lambda.sh` - Deploy Lambda code
- `deploy-frontend.sh` - Deploy frontend files
- `invalidate-cloudfront.sh` - Clear CDN cache

## 🚀 Quick Links

### Getting Started
1. [Quick Start Guide](QUICKSTART.md) - Deploy in 5 minutes
2. [Prerequisites](#prerequisites) - What you need
3. [Deployment Steps](#deployment-steps) - Step-by-step guide

### Development
- [Frontend Code](frontend/) - HTML, CSS, JavaScript
- [Lambda Code](lambda/) - Node.js backend
- [Infrastructure](infrastructure/) - CloudFormation templates

### Operations
- [Monitoring Setup](DEPLOYMENT.md#step-8-optional-set-up-monitoring)
- [Troubleshooting](README.md#troubleshooting)
- [Cost Estimation](README.md#cost-estimation)

## 🎯 Common Tasks

### First Time Setup
```bash
# 1. Deploy infrastructure
cd scripts && ./deploy-infrastructure.sh

# 2. Update frontend config
# Edit frontend/app.js with API Gateway URL

# 3. Deploy Lambda
./deploy-lambda.sh

# 4. Deploy frontend
./deploy-frontend.sh
```

### Update Lambda Code
```bash
cd scripts && ./deploy-lambda.sh
```

### Update Frontend
```bash
cd scripts && ./deploy-frontend.sh
```

### View Logs
```bash
aws logs tail /aws/lambda/weather-dashboard-function --follow
```

### Test API
```bash
curl "https://your-api-url/prod/weather?city=London"
```

## 📋 Prerequisites

- ✅ AWS Account
- ✅ AWS CLI installed and configured
- ✅ OpenWeatherMap API Key
- ✅ Node.js 18.x or later
- ✅ Bash shell

## 🏗️ Architecture

```
User Browser
    ↓
CloudFront (Optional CDN)
    ↓
S3 Static Website
    ↓
API Gateway
    ↓
Lambda Function
    ↓
OpenWeatherMap API
```

## 🔧 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js 18.x, AWS Lambda
- **API**: AWS API Gateway (REST)
- **Storage**: AWS S3
- **CDN**: AWS CloudFront (optional)
- **Monitoring**: AWS CloudWatch
- **External API**: OpenWeatherMap

## 📊 Features

- ✅ Current weather display
- ✅ 5-day forecast
- ✅ City search
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading indicators
- ✅ Input validation

## 💰 Cost

**Free Tier Usage**: $0/month
**Moderate Usage**: $0-5/month

See [Cost Estimation](README.md#cost-estimation) for details.

## 🔒 Security

- API key encrypted in Lambda
- CORS configured
- IAM least privilege
- CloudWatch audit logs
- Input validation

## 📞 Support

### Troubleshooting
1. Check [Troubleshooting Guide](README.md#troubleshooting)
2. Review CloudWatch Logs
3. Verify AWS CLI configuration
4. Test API endpoints

### Resources
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [OpenWeatherMap API](https://openweathermap.org/api)

## 🎓 Learning Resources

- [AWS Serverless](https://aws.amazon.com/serverless/)
- [CloudFormation Guide](https://docs.aws.amazon.com/cloudformation/)
- [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🗺️ Roadmap

### Completed ✅
- Core weather functionality
- 5-day forecast
- Responsive design
- AWS infrastructure
- Deployment automation
- Documentation

### Future Enhancements 🚀
- Unit conversion (C/F)
- Geolocation
- Dark mode
- PWA support
- User accounts
- Weather alerts

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

**Ready to get started? → [QUICKSTART.md](QUICKSTART.md)**
