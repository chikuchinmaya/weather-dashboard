# Quick Command Reference

## 🐳 Docker Commands (Easiest Deployment)

### Quick Start
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Full Docker Commands
```bash
# Build and start
docker-compose up -d --build

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f
docker-compose logs -f weather-backend
docker-compose logs -f weather-frontend

# Check status
docker-compose ps

# Restart services
docker-compose restart

# Rebuild images
docker-compose build --no-cache

# View stats
docker stats

# Execute command in container
docker-compose exec weather-backend sh
```

### Docker Testing
```bash
# Test backend
curl http://localhost:3000/weather?city=London

# Test frontend
curl http://localhost:8080

# Check health
docker inspect --format='{{.State.Health.Status}}' weather-dashboard-backend
```

## 🚀 Git Commands for GitHub Upload

### Initialize and Push
```bash
cd newproject
git init
git add .
git commit -m "Initial commit: Weather Dashboard"
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git
git branch -M main
git push -u origin main
```

### Update After Changes
```bash
git add .
git commit -m "Update: description of changes"
git push
```

## 💻 Local Development Commands

### Start Local Server
```bash
cd local-dev
npm install
npm start
```

### Development Mode (Auto-restart)
```bash
cd local-dev
npm run dev
```

### Test API Endpoints
```bash
curl "http://localhost:3000/weather?city=London"
curl "http://localhost:3000/forecast?city=Paris"
```

## ☁️ AWS Deployment Commands

### Deploy Infrastructure
```bash
cd scripts
chmod +x *.sh
./deploy-infrastructure.sh
```

### Deploy Lambda Function
```bash
cd scripts
./deploy-lambda.sh
```

### Deploy Frontend
```bash
cd scripts
./deploy-frontend.sh
```

### Invalidate CloudFront Cache
```bash
cd scripts
./invalidate-cloudfront.sh
```

## 🔧 Maintenance Commands

### Update Dependencies
```bash
cd local-dev
npm update
```

### Check for Vulnerabilities
```bash
cd local-dev
npm audit
npm audit fix
```

### Clean Install
```bash
cd local-dev
rm -rf node_modules package-lock.json
npm install
```

## 📊 AWS CLI Commands

### Check Lambda Function
```bash
aws lambda get-function --function-name weather-dashboard-function
```

### View Lambda Logs
```bash
aws logs tail /aws/lambda/weather-dashboard-function --follow
```

### List S3 Buckets
```bash
aws s3 ls
```

### Sync Frontend to S3
```bash
aws s3 sync frontend/ s3://your-bucket-name/
```

### Check CloudFormation Stacks
```bash
aws cloudformation list-stacks
aws cloudformation describe-stacks --stack-name weather-dashboard-stack
```

## 🧪 Testing Commands

### Test Local Server
```bash
# In browser
http://localhost:3000/weather?city=London

# With curl
curl "http://localhost:3000/weather?city=London"
```

### Test AWS Deployment
```bash
curl "https://your-api-gateway-url/prod/weather?city=London"
```

## 📝 Documentation Commands

### View Documentation
```bash
cat README.md
cat DEPLOYMENT.md
cat QUICKSTART.md
```

### Open in Browser
```bash
# Windows
start README.md

# Mac
open README.md

# Linux
xdg-open README.md
```

## 🔐 Environment Setup

### Create .env File
```bash
cd local-dev
cp .env.example .env
# Edit .env and add your API key
```

### Set AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region
# Enter your default output format
```

## 📦 Package Commands

### Create Lambda Deployment Package
```bash
cd lambda
npm install --production
zip -r function.zip .
```

### Create Frontend Package
```bash
cd frontend
zip -r frontend.zip .
```

## 🎯 Quick Actions

### Full Local Setup
```bash
cd newproject/local-dev
npm install
# Add API key to .env
npm start
# Open index.html
```

### Full AWS Deployment
```bash
cd newproject/scripts
./deploy-infrastructure.sh
# Update frontend/app.js with API Gateway URL
./deploy-lambda.sh
./deploy-frontend.sh
```

### Update Both Versions
```bash
# Update local
cd local-dev
git pull
npm install
npm start

# Update AWS
cd ../scripts
./deploy-lambda.sh
./deploy-frontend.sh
```

## 🐛 Troubleshooting Commands

### Check Node Version
```bash
node --version
npm --version
```

### Check AWS CLI
```bash
aws --version
aws sts get-caller-identity
```

### Check Running Processes
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

### Kill Process on Port 3000
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

## 📱 Mobile Testing

### Test on Mobile Device
```bash
# Find your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from mobile
http://YOUR_LOCAL_IP:3000
```

## 🔄 Backup Commands

### Backup Project
```bash
cd ..
tar -czf weather-dashboard-backup.tar.gz newproject/
```

### Restore from Backup
```bash
tar -xzf weather-dashboard-backup.tar.gz
```

## 📊 Statistics Commands

### Count Lines of Code
```bash
# Windows PowerShell
(Get-ChildItem -Recurse -Include *.js,*.html,*.css | Get-Content | Measure-Object -Line).Lines

# Mac/Linux
find . -name '*.js' -o -name '*.html' -o -name '*.css' | xargs wc -l
```

### Count Files
```bash
# Windows PowerShell
(Get-ChildItem -Recurse -File).Count

# Mac/Linux
find . -type f | wc -l
```

---

**Quick Reference for Weather Dashboard** 🌤️
