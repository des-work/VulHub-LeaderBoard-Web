# 🚀 VulHub Deployment Guide

**Complete deployment and production operations guide**

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [CI/CD Pipeline](#cicd-pipeline)
- [Docker Deployment](#docker-deployment)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Production Validation](#production-validation)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)

---

## 🚀 Quick Start

### One-Command Deployment

```bash
# Clone repository
git clone https://github.com/your-org/vulhub.git
cd vulhub

# Run deployment script
cd apps/api
chmod +x scripts/deploy.sh
./scripts/deploy.sh --environment production --deploy-target docker
```

### Post-Deployment Validation

```bash
# Run comprehensive health checks
./scripts/health-check.sh --url https://your-api-domain.com

# Run production validation
./scripts/validate-production.sh --api-url https://your-api-domain.com
```

---

## 📋 Prerequisites

### System Requirements

- **Node.js**: 18.x or higher
- **PNPM**: Latest version
- **Docker**: 20.x or higher (for containerized deployment)
- **PostgreSQL**: 15.x or higher
- **Redis**: 7.x or higher

### Environment Setup

1. **Install PNPM**:
   ```bash
   npm install -g pnpm
   ```

2. **Install Docker** (optional but recommended):
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh

   # macOS
   brew install --cask docker
   ```

3. **Setup PostgreSQL and Redis**:
   ```bash
   # Using Docker (recommended for development)
   docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
   docker run -d --name redis -p 6379:6379 redis:7-alpine
   ```

### Domain and SSL

- **Domain Name**: Configure DNS for your API domain
- **SSL Certificate**: Use Let's Encrypt or commercial SSL certificates
- **CDN**: Optional but recommended for production (Cloudflare, AWS CloudFront)

---

## 🏠 Local Development

### Development Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Configure local environment
echo "DATABASE_URL=file:./dev.db" >> .env.local
echo "REDIS_HOST=localhost" >> .env.local
echo "JWT_SECRET=dev-jwt-secret" >> .env.local
echo "JWT_REFRESH_SECRET=dev-refresh-secret" >> .env.local

# Run database migrations
cd apps/api
npx prisma migrate dev

# Start development server
pnpm run dev
```

### Local Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm run test:coverage

# Run specific test suites
pnpm run test:unit
pnpm run test:integration
pnpm run test:e2e
pnpm run test:performance
```

### Local Deployment Testing

```bash
# Build for production
pnpm run build

# Start production server locally
pnpm run start:prod

# Test deployment script locally
./scripts/deploy.sh --environment development --deploy-target local
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

The repository includes a comprehensive CI/CD pipeline (`.github/workflows/ci-cd.yml`) with:

#### Pipeline Stages

1. **Quality Checks**: Linting, type checking, security scanning
2. **Unit Tests**: Individual component testing
3. **Integration Tests**: Service interaction testing
4. **E2E Tests**: Complete user workflow testing
5. **Build & Package**: Docker image creation
6. **Deploy to Staging**: Automated staging deployment
7. **Deploy to Production**: Automated production deployment
8. **Performance Tests**: Load testing and benchmarks
9. **Security Scanning**: Vulnerability assessment
10. **Monitoring Updates**: Deployment tracking

#### Required Secrets

Add these secrets to your GitHub repository:

```bash
# Docker Registry
REGISTRY: ghcr.io
DOCKER_USERNAME: ${{ github.actor }}
DOCKER_PASSWORD: ${{ secrets.GITHUB_TOKEN }}

# Staging Environment
STAGING_API_KEY: your-staging-api-key
STAGING_DATABASE_URL: postgresql://...

# Production Environment
PROD_API_KEY: your-prod-api-key
PROD_DATABASE_URL: postgresql://...

# Monitoring (optional)
OTEL_ENDPOINT: https://your-otel-endpoint.com
SLACK_WEBHOOK_URL: https://hooks.slack.com/...
```

#### Branch Protection

Configure branch protection rules:

```yaml
# For main branch
required_status_checks:
  - quality-checks
  - unit-tests
  - integration-tests
  - e2e-tests
  - build
  - security-scan

required_pull_request_reviews: true
restrictions: []  # or specify allowed teams/users
```

### Manual Pipeline Triggers

```bash
# Trigger staging deployment
gh workflow run ci-cd.yml --ref develop

# Trigger production deployment
gh workflow run ci-cd.yml --ref main

# Trigger with custom environment
gh workflow run ci-cd.yml --ref main \
  -f environment=production
```

---

## 🐳 Docker Deployment

### Single Container Deployment

```bash
# Build production image
docker build -f apps/api/Dockerfile.production -t vulhub-api:latest .

# Run container
docker run -d \
  --name vulhub-api \
  -p 4000:4000 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://... \
  -e REDIS_HOST=redis \
  -e JWT_SECRET=your-secret \
  vulhub-api:latest
```

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile.production
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://db:5432/vulhub
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=vulhub
      - POSTGRES_USER=vulhub
      - POSTGRES_PASSWORD=secure-password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

### Docker Registry

```bash
# Login to registry
docker login ghcr.io

# Tag and push
docker tag vulhub-api:latest ghcr.io/your-org/vulhub-api:latest
docker push ghcr.io/your-org/vulhub-api:latest
```

---

## ☸️ Kubernetes Deployment

### Prerequisites

```bash
# Install kubectl and helm
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace vulhub

# Apply configurations
kubectl apply -f apps/api/k8s/configmap.yaml
kubectl apply -f apps/api/k8s/secret.yaml
kubectl apply -f apps/api/k8s/deployment.yaml
kubectl apply -f apps/api/k8s/service.yaml
kubectl apply -f apps/api/k8s/ingress.yaml
kubectl apply -f apps/api/k8s/hpa.yaml

# Check deployment status
kubectl get pods -n vulhub
kubectl get services -n vulhub
kubectl get ingress -n vulhub
```

### Kubernetes Secrets Setup

```bash
# Create secrets from files
kubectl create secret generic vulhub-secrets \
  --from-literal=database-url='postgresql://...' \
  --from-literal=jwt-secret='your-jwt-secret' \
  --from-literal=jwt-refresh-secret='your-refresh-secret'

# Or from environment variables
export DB_URL='postgresql://...'
export JWT_SECRET='your-secret'
kubectl create secret generic vulhub-secrets \
  --from-literal=database-url=$DB_URL \
  --from-literal=jwt-secret=$JWT_SECRET
```

### Monitoring Kubernetes

```bash
# Check pod health
kubectl describe pods -n vulhub

# View logs
kubectl logs -f deployment/vulhub-api -n vulhub

# Check resource usage
kubectl top pods -n vulhub

# Scale deployment
kubectl scale deployment vulhub-api --replicas=5 -n vulhub
```

---

## 🌐 Heroku Deployment

### Prerequisites

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login to Heroku
heroku login
```

### Deploy to Heroku

```bash
# Create Heroku app
heroku create your-vulhub-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=postgresql://...
heroku config:set REDIS_URL=redis://...
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main

# Run database migrations
heroku run npx prisma migrate deploy

# Check logs
heroku logs --tail
```

### Heroku Add-ons

```bash
# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Add monitoring
heroku addons:create papertrail
heroku addons:create librato
```

---

## ✅ Production Validation

### Automated Validation

```bash
# Run comprehensive validation
./scripts/validate-production.sh \
  --api-url https://api.vulhub.edu \
  --web-url https://vulhub.edu

# Quick health check
./scripts/health-check.sh \
  --url https://api.vulhub.edu \
  --quick
```

### Manual Validation Checklist

#### Infrastructure
- [ ] SSL certificate valid and current
- [ ] DNS records point to correct IP
- [ ] Firewall allows necessary ports
- [ ] Load balancer configured correctly

#### Application
- [ ] All health endpoints return 200
- [ ] Configuration validation passes
- [ ] Database connections working
- [ ] Redis connections working
- [ ] External services accessible

#### Performance
- [ ] Response times within acceptable limits
- [ ] Memory usage normal
- [ ] CPU usage normal
- [ ] Error rates below threshold

#### Security
- [ ] Security headers present
- [ ] HTTPS enforced
- [ ] Rate limiting working
- [ ] Authentication functioning

### Performance Benchmarks

| Metric | Target | Critical |
|--------|--------|----------|
| Health Check | < 1s | < 5s |
| API Response | < 2s | < 10s |
| Database Query | < 1s | < 5s |
| Memory Usage | < 80% | < 95% |
| Error Rate | < 1% | < 5% |

---

## 📊 Monitoring & Maintenance

### Health Endpoints

```bash
# Basic health (for load balancers)
curl https://api.vulhub.edu/health

# Readiness (for Kubernetes)
curl https://api.vulhub.edu/ready

# Liveness (for Kubernetes)
curl https://api.vulhub.edu/api/v1/health/live

# Detailed status
curl https://api.vulhub.edu/api/v1/health/detailed

# Configuration validation
curl https://api.vulhub.edu/api/v1/health/config

# Performance metrics
curl https://api.vulhub.edu/api/v1/health/metrics
```

### Monitoring Setup

#### Application Metrics
```bash
# Prometheus metrics (if enabled)
curl https://api.vulhub.edu/metrics

# Health check integration
# Add to your monitoring system:
# https://api.vulhub.edu/api/v1/health/detailed
```

#### Log Aggregation
```bash
# View application logs
heroku logs --app your-vulhub-api --tail

# Kubernetes logs
kubectl logs -f deployment/vulhub-api -n vulhub

# Docker logs
docker logs -f vulhub-api
```

#### Alerting Rules

**Critical Alerts**:
- Health check failures
- High error rates (>5%)
- Database connection issues
- SSL certificate expiration (< 30 days)

**Warning Alerts**:
- High response times (> 5s)
- High memory usage (> 85%)
- Rate limiting triggered frequently

### Maintenance Tasks

#### Daily
```bash
# Check health endpoints
curl -f https://api.vulhub.edu/api/v1/health/detailed

# Monitor error rates
curl https://api.vulhub.edu/api/v1/health/metrics
```

#### Weekly
```bash
# Review logs for anomalies
heroku logs --app your-vulhub-api --num 1000

# Check database performance
# Run EXPLAIN ANALYZE on slow queries
```

#### Monthly
```bash
# Security updates
# Review and rotate secrets
# Performance optimization
# Backup verification
```

---

## 🔧 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check environment variables
./scripts/validate-production.sh --api-url http://localhost:4000

# Check logs
docker logs vulhub-api
heroku logs --app your-vulhub-api

# Validate configuration
curl http://localhost:4000/api/v1/health/config
```

#### Database Connection Issues
```bash
# Test database connectivity
psql "your-database-url" -c "SELECT 1"

# Check database health
curl http://localhost:4000/api/v1/health/detailed | jq '.checks.database'
```

#### High Error Rates
```bash
# Check application logs
heroku logs --app your-vulhub-api --source app

# Review error details
curl http://localhost:4000/api/v1/health/detailed | jq '.metrics'
```

#### Performance Issues
```bash
# Check resource usage
curl http://localhost:4000/api/v1/health/metrics

# Profile slow endpoints
# Add logging to identify bottlenecks
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
export NODE_ENV=development

# Run with verbose output
./scripts/health-check.sh --verbose --url http://localhost:4000
```

---

## 🔄 Rollback Procedures

### Automated Rollback

```bash
# Rollback deployment
./scripts/deploy.sh --rollback --deploy-target docker

# For Kubernetes
kubectl rollout undo deployment/vulhub-api

# For Heroku
heroku releases --app your-app-name
heroku releases:rollback v123  # Replace with previous release
```

### Manual Rollback Steps

1. **Identify Issue**:
   ```bash
   # Check health status
   curl https://api.vulhub.edu/api/v1/health/detailed

   # Review recent logs
   heroku logs --app your-app-name --num 100
   ```

2. **Prepare Rollback**:
   ```bash
   # Backup current state if needed
   # Document the issue and symptoms
   ```

3. **Execute Rollback**:
   ```bash
   # Stop current deployment
   kubectl scale deployment vulhub-api --replicas=0

   # Deploy previous version
   kubectl set image deployment/vulhub-api api=your-app:previous-tag

   # Scale back up
   kubectl scale deployment vulhub-api --replicas=3
   ```

4. **Verify Rollback**:
   ```bash
   # Run validation
   ./scripts/validate-production.sh

   # Monitor for 30 minutes
   watch -n 30 ./scripts/health-check.sh --quick
   ```

5. **Post-Rollback Analysis**:
   - Document the root cause
   - Implement fix for the issue
   - Test fix in staging before re-deploying

---

## 📞 Support & Resources

### Documentation Links
- [API Documentation](https://api.vulhub.edu/api/docs)
- [Health Check Endpoints](https://api.vulhub.edu/api/v1/health)
- [Configuration Guide](apps/api/src/config/CONFIGURATION_GUIDE.md)

### Emergency Contacts
- **On-call Engineer**: +1-XXX-XXX-XXXX
- **DevOps Team**: devops@vulhub.edu
- **Security Issues**: security@vulhub.edu

### Useful Commands

```bash
# Quick status check
curl -s https://api.vulhub.edu/health | jq .

# Full system status
curl -s https://api.vulhub.edu/api/v1/health/detailed | jq .

# Recent deployments
heroku releases --app your-app-name | head -10

# Database status
heroku pg:info --app your-app-name
```

---

**🎉 Happy Deploying!** Your VulHub API is now ready for production deployment with comprehensive monitoring, validation, and rollback capabilities.