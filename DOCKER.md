# 🐳 Docker Deployment Guide

Easy deployment of Weather Dashboard using Docker and Docker Compose.

## 📋 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)
- OpenWeatherMap API key ([Get free key](https://openweathermap.org/api))

## 🚀 Quick Start (3 Steps)

### 1. Clone and Navigate
```bash
git clone https://github.com/YOUR_USERNAME/weather-dashboard.git
cd weather-dashboard
```

### 2. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API key
# OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Start with Docker Compose
```bash
docker-compose up -d
```

**That's it!** Your Weather Dashboard is now running! 🎉

- **Backend API:** http://localhost:3000
- **Frontend UI:** http://localhost:8080

## 📦 What Gets Deployed

### Services

#### 1. Weather Backend (Port 3000)
- Node.js server handling API requests
- Connects to OpenWeatherMap API
- Health checks enabled
- Auto-restart on failure

#### 2. Weather Frontend (Port 8080)
- Nginx serving static files
- Optimized with gzip compression
- Caching enabled
- Security headers configured

## 🔧 Docker Commands

### Start Services
```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d weather-backend
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop specific service
docker-compose stop weather-backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f weather-backend
docker-compose logs -f weather-frontend

# Last 100 lines
docker-compose logs --tail=100
```

### Check Status
```bash
# List running containers
docker-compose ps

# Check health
docker-compose ps
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart weather-backend
```

### Rebuild Images
```bash
# Rebuild and start
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
```

## 🔍 Testing the Deployment

### Test Backend API
```bash
# Test weather endpoint
curl http://localhost:3000/weather?city=London

# Test forecast endpoint
curl http://localhost:3000/forecast?city=Paris
```

### Test Frontend
Open in browser: http://localhost:8080

### Health Checks
```bash
# Backend health
curl http://localhost:3000/weather?city=London

# Frontend health
curl http://localhost:8080/health
```

## 🛠️ Configuration

### Environment Variables

Edit `.env` file:
```bash
# Required
OPENWEATHER_API_KEY=your_api_key_here

# Optional
API_RATE_LIMIT=60
LOG_LEVEL=INFO
NODE_ENV=production
```

### Port Configuration

Edit `docker-compose.yml` to change ports:
```yaml
services:
  weather-backend:
    ports:
      - "3000:3000"  # Change first number for host port
  
  weather-frontend:
    ports:
      - "8080:80"    # Change first number for host port
```

## 📊 Resource Usage

### Default Limits
- **Memory:** No limit (uses available)
- **CPU:** No limit (uses available)

### Add Resource Limits

Edit `docker-compose.yml`:
```yaml
services:
  weather-backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## 🔐 Security Best Practices

### 1. Use Environment Variables
```bash
# Never commit .env file
echo ".env" >> .gitignore
```

### 2. Run as Non-Root User
Already configured in Dockerfile:
```dockerfile
USER nodejs
```

### 3. Keep Images Updated
```bash
# Update base images
docker-compose pull
docker-compose up -d --build
```

### 4. Scan for Vulnerabilities
```bash
# Scan image
docker scan weather-dashboard-backend
```

## 🐛 Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker-compose logs weather-backend
```

**Common issues:**
- Missing API key in .env
- Port already in use
- Insufficient permissions

### Port Already in Use

**Find process using port:**
```bash
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

**Change port in docker-compose.yml:**
```yaml
ports:
  - "3001:3000"  # Use different host port
```

### API Key Not Working

**Verify environment:**
```bash
docker-compose exec weather-backend env | grep OPENWEATHER
```

**Restart after changing .env:**
```bash
docker-compose down
docker-compose up -d
```

### Container Keeps Restarting

**Check health:**
```bash
docker-compose ps
docker inspect weather-dashboard-backend
```

**View detailed logs:**
```bash
docker-compose logs --tail=50 weather-backend
```

## 📈 Monitoring

### View Container Stats
```bash
# Real-time stats
docker stats

# Specific container
docker stats weather-dashboard-backend
```

### Check Health Status
```bash
docker inspect --format='{{.State.Health.Status}}' weather-dashboard-backend
```

### View Logs
```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific time range
docker-compose logs --since 30m
```

## 🚀 Production Deployment

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml weather

# Check services
docker service ls

# Scale services
docker service scale weather_weather-backend=3
```

### Using Kubernetes

Convert to Kubernetes:
```bash
# Install kompose
# Convert docker-compose to k8s
kompose convert

# Deploy to k8s
kubectl apply -f .
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Backup Data

```bash
# Backup volumes
docker run --rm -v weather-data:/data -v $(pwd):/backup alpine tar czf /backup/weather-data-backup.tar.gz /data
```

### Clean Up

```bash
# Remove stopped containers
docker-compose rm

# Remove unused images
docker image prune

# Remove everything
docker system prune -a
```

## 📝 Docker Image Details

### Image Size
- **Base:** node:18-alpine (~170MB)
- **Final:** ~180MB (optimized)

### Layers
- Base Node.js image
- Dependencies
- Application code
- Configuration

### Optimization
- Multi-stage build
- Alpine Linux base
- Production dependencies only
- Non-root user

## 🌐 Networking

### Default Network
- Bridge network: `weather-network`
- Services can communicate by name

### Custom Network

```yaml
networks:
  weather-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.25.0.0/16
```

## 💾 Volumes

### Persistent Data

Add volumes for logs:
```yaml
services:
  weather-backend:
    volumes:
      - ./logs:/app/logs
```

## 🎯 Advanced Usage

### Development Mode

Create `docker-compose.dev.yml`:
```yaml
version: '3.8'
services:
  weather-backend:
    build:
      context: .
      target: builder
    volumes:
      - ./local-dev:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

Run with:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### CI/CD Integration

```yaml
# .github/workflows/docker.yml
name: Docker Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build image
        run: docker build -t weather-dashboard .
      - name: Run tests
        run: docker run weather-dashboard npm test
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

## 🆘 Getting Help

If you encounter issues:
1. Check logs: `docker-compose logs`
2. Verify configuration: `docker-compose config`
3. Check health: `docker-compose ps`
4. Review this guide
5. Open an issue on GitHub

## ✅ Quick Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Logs
docker-compose logs -f

# Restart
docker-compose restart

# Rebuild
docker-compose up -d --build

# Status
docker-compose ps

# Clean
docker-compose down -v
```

---

**Developed by Chinmaya Dalai** 🐳🌤️
