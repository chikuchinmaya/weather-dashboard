# Weather Dashboard - Start Here! 🌤️

Welcome! This project has **two versions** - choose the one that fits your needs.

## 🎯 Which Version Should I Use?

### 🏠 Local Development (Recommended for Beginners)

**Best for:**
- Learning and testing
- Quick setup (5 minutes)
- No AWS account needed
- No costs
- Offline development

**Location:** `local-dev/` folder

**Quick Start:**
```bash
cd local-dev
npm install
npm start
# Then open index.html in your browser
```

📖 **Read:** `local-dev/SETUP_GUIDE.md`

---

### ☁️ AWS Production (For Deployment)

**Best for:**
- Production deployment
- Global availability
- Auto-scaling
- 24/7 uptime
- Public access

**Location:** Root folder (frontend/, lambda/, infrastructure/)

**Quick Start:**
```bash
cd scripts
./deploy-infrastructure.sh
./deploy-lambda.sh
./deploy-frontend.sh
```

📖 **Read:** `DEPLOYMENT.md`

---

## 📊 Comparison

| Feature | Local Dev | AWS Production |
|---------|-----------|----------------|
| **Setup Time** | 5 minutes | 15-20 minutes |
| **Cost** | Free | $0-5/month |
| **Requirements** | Node.js | AWS Account |
| **Availability** | Local only | Global |
| **Scalability** | Single user | Auto-scaling |
| **Best For** | Development | Production |

## 🚀 Recommended Path

### For Beginners:
1. ✅ Start with **Local Development**
2. ✅ Learn how it works
3. ✅ Make changes and test
4. ✅ When ready, deploy to AWS

### For Experienced Developers:
1. ✅ Review the code
2. ✅ Choose your deployment method
3. ✅ Deploy directly to AWS if needed

## 📁 Project Structure

```
newproject/
│
├── 📂 local-dev/              ← Start here for local development
│   ├── server.js              (Node.js backend)
│   ├── index.html             (Frontend)
│   ├── app.js                 (Frontend JS)
│   ├── styles.css             (Frontend CSS)
│   ├── SETUP_GUIDE.md         (Complete setup guide)
│   └── README.md              (Quick reference)
│
├── 📂 frontend/               ← AWS version frontend
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── 📂 lambda/                 ← AWS Lambda function
│   ├── index.js
│   └── package.json
│
├── 📂 infrastructure/         ← AWS CloudFormation templates
│   ├── cloudformation-template.yaml
│   ├── s3-bucket-template.yaml
│   └── cloudfront-template.yaml
│
├── 📂 scripts/                ← Deployment scripts
│   ├── deploy-infrastructure.sh
│   ├── deploy-lambda.sh
│   └── deploy-frontend.sh
│
├── 📄 START_HERE.md           ← You are here!
├── 📄 README.md               ← Full project documentation
├── 📄 DEPLOYMENT.md           ← AWS deployment guide
├── 📄 QUICKSTART.md           ← AWS quick start
└── 📄 LOCAL_DEV_SUMMARY.md    ← Local dev overview
```

## 🎓 Learning Resources

### Documentation Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `START_HERE.md` | Choose your version | **Read first!** |
| `local-dev/SETUP_GUIDE.md` | Local setup | For local development |
| `DEPLOYMENT.md` | AWS deployment | For AWS deployment |
| `README.md` | Complete docs | For full understanding |
| `QUICKSTART.md` | AWS quick start | For fast AWS setup |

### Quick Links

- 🏠 **Local Development:** [local-dev/SETUP_GUIDE.md](local-dev/SETUP_GUIDE.md)
- ☁️ **AWS Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)
- 📖 **Full Documentation:** [README.md](README.md)
- ⚡ **AWS Quick Start:** [QUICKSTART.md](QUICKSTART.md)

## 🎯 Quick Decision Guide

### Choose Local Development if:
- ✅ You want to learn first
- ✅ You don't have AWS account
- ✅ You want quick setup
- ✅ You're testing/developing
- ✅ You want zero costs

### Choose AWS Production if:
- ✅ You need public access
- ✅ You want 24/7 availability
- ✅ You need auto-scaling
- ✅ You're deploying for real users
- ✅ You have AWS account

## 📋 Prerequisites

### For Local Development:
- Node.js 14+ installed
- npm (comes with Node.js)
- OpenWeatherMap API key (free)
- Web browser

### For AWS Production:
- AWS Account
- AWS CLI configured
- OpenWeatherMap API key (free)
- Node.js 14+ (for deployment)

## 🚀 Next Steps

### Option 1: Local Development (Recommended First)

```bash
# 1. Navigate to local-dev
cd local-dev

# 2. Read the setup guide
cat SETUP_GUIDE.md

# 3. Install dependencies
npm install

# 4. Add your API key to .env file
# Edit .env and add: OPENWEATHER_API_KEY=your_key_here

# 5. Start the server
npm start

# 6. Open index.html in your browser
```

### Option 2: AWS Production

```bash
# 1. Read the deployment guide
cat DEPLOYMENT.md

# 2. Deploy infrastructure
cd scripts
./deploy-infrastructure.sh

# 3. Update frontend config
# Edit frontend/app.js with API Gateway URL

# 4. Deploy Lambda
./deploy-lambda.sh

# 5. Deploy frontend
./deploy-frontend.sh
```

## 💡 Pro Tips

1. **Start Local:** Even if you plan to deploy to AWS, start with local development to understand the app

2. **Test First:** Test everything locally before deploying to AWS

3. **Read Docs:** Each folder has its own README with specific instructions

4. **Keep Both:** You can use local dev for testing and AWS for production

5. **Learn Gradually:** Master local development, then move to AWS

## 🎊 Success Indicators

### Local Development Success:
- ✅ Server running on localhost:3000
- ✅ Frontend opens in browser
- ✅ Can search for cities
- ✅ Weather data displays
- ✅ Forecast shows 5 days

### AWS Deployment Success:
- ✅ CloudFormation stacks created
- ✅ Lambda function deployed
- ✅ API Gateway endpoints working
- ✅ S3 website accessible
- ✅ Frontend shows weather data

## 🐛 Troubleshooting

### Local Development Issues:
→ See `local-dev/SETUP_GUIDE.md` troubleshooting section

### AWS Deployment Issues:
→ See `DEPLOYMENT.md` troubleshooting section

### General Issues:
→ See `README.md` troubleshooting section

## 📞 Getting Help

1. **Check Documentation:**
   - Local: `local-dev/SETUP_GUIDE.md`
   - AWS: `DEPLOYMENT.md`
   - General: `README.md`

2. **Check Logs:**
   - Local: Terminal output
   - AWS: CloudWatch Logs

3. **Test Components:**
   - Local: curl http://localhost:3000/weather?city=London
   - AWS: curl your-api-gateway-url/weather?city=London

## 🎯 Your Journey

```
1. Read START_HERE.md (you are here!)
        ↓
2. Choose: Local Dev or AWS?
        ↓
   ┌────────────────┬────────────────┐
   ↓                ↓                ↓
Local Dev        or              AWS
   ↓                                ↓
Setup Guide                  Deployment Guide
   ↓                                ↓
Test & Learn                 Deploy & Monitor
   ↓                                ↓
   └────────────────┬────────────────┘
                    ↓
            Production Ready! 🎉
```

## 🌟 Features

Both versions include:
- ✅ Current weather display
- ✅ 5-day forecast
- ✅ City search
- ✅ Responsive design
- ✅ Error handling
- ✅ Input validation
- ✅ Loading indicators

## 📚 Additional Resources

- **OpenWeatherMap API:** https://openweathermap.org/api
- **Node.js Documentation:** https://nodejs.org/docs
- **AWS Lambda Guide:** https://docs.aws.amazon.com/lambda/
- **AWS CLI Setup:** https://docs.aws.amazon.com/cli/

## ✅ Checklist

Before you start:
- [ ] Read this file (START_HERE.md)
- [ ] Decide: Local Dev or AWS?
- [ ] Have OpenWeatherMap API key
- [ ] Have required tools installed
- [ ] Read relevant documentation

## 🎉 Ready to Start!

Choose your path:

### 🏠 Local Development
→ Go to `local-dev/` folder
→ Read `SETUP_GUIDE.md`
→ Run `npm install && npm start`

### ☁️ AWS Production
→ Stay in root folder
→ Read `DEPLOYMENT.md`
→ Run deployment scripts

---

**Happy coding! 🌤️**

*Questions? Check the documentation files or review the troubleshooting sections.*
