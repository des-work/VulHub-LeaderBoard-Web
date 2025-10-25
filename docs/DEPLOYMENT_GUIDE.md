# 🚀 VulHub Leaderboard - Complete Deployment Guide

This comprehensive guide will walk you through deploying the VulHub Leaderboard application to Heroku, from initial setup to going live.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Configuration](#database-configuration)
4. [Heroku Application Setup](#heroku-application-setup)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Database Migration](#database-migration)
7. [Deployment Process](#deployment-process)
8. [Post-Deployment Verification](#post-deployment-verification)
9. [Monitoring and Maintenance](#monitoring-and-maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- [Heroku Account](https://heroku.com) (Free tier available)
- [GitHub Account](https://github.com) (for code repository)
- [PostgreSQL Database](https://www.postgresql.org) (Heroku Postgres add-on)
- [Redis Instance](https://redis.io) (Heroku Redis add-on)

### Required Software
- [Node.js](https://nodejs.org) (v18.0.0 or higher)
- [pnpm](https://pnpm.io) (v8.0.0 or higher)
- [Git](https://git-scm.com)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

### Verify Installation
```bash
# Check Node.js version
node --version  # Should be v18.0.0+

# Check pnpm version
pnpm --version  # Should be v8.0.0+

# Check Git version
git --version

# Check Heroku CLI
heroku --version
```

---

## Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd VulHub-LeaderBoard-Web
```

### 2. Install Dependencies
```bash
# Install all dependencies
pnpm install

# Verify all packages build successfully
pnpm build
```

### 3. Verify Local Development
```bash
# Start the development servers
pnpm dev

# The application should be available at:
# - Web App: http://localhost:3000
# - API: http://localhost:3001
```

---

## Database Configuration

### 1. Local Database Setup (Optional)
For local development, you can set up a local PostgreSQL database:

```bash
# Install PostgreSQL (varies by OS)
# Windows: Download from postgresql.org
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql

# Create a local database
createdb vulhub_leaderboard_dev
```

### 2. Environment Variables for Local Development
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/vulhub_leaderboard_dev"

# Redis
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="1h"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key-here"
REFRESH_TOKEN_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:3000"

# Email (Optional for development)
EMAIL_SERVICE_HOST="smtp.gmail.com"
EMAIL_SERVICE_PORT="587"
EMAIL_SERVICE_USER="your-email@gmail.com"
EMAIL_SERVICE_PASSWORD="your-app-password"
EMAIL_FROM="noreply@vulhub.com"

# Storage (Optional for development)
STORAGE_ACCESS_KEY="minioadmin"
STORAGE_SECRET_KEY="minioadmin"
STORAGE_ENDPOINT="http://localhost:9000"
STORAGE_BUCKET="vulhub-evidence"
```

---

## Heroku Application Setup

### 1. Create Heroku Applications
```bash
# Login to Heroku
heroku login

# Create applications (one for web, one for API)
heroku create vulhub-leaderboard-web
heroku create vulhub-leaderboard-api

# Add Git remotes
git remote add heroku-web https://git.heroku.com/vulhub-leaderboard-web.git
git remote add heroku-api https://git.heroku.com/vulhub-leaderboard-api.git
```

### 2. Configure Buildpacks
```bash
# For the web application
heroku buildpacks:set heroku/nodejs -a vulhub-leaderboard-web

# For the API application
heroku buildpacks:set heroku/nodejs -a vulhub-leaderboard-api
```

### 3. Add Required Add-ons
```bash
# Add PostgreSQL to API app
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-api

# Add Redis to API app
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-api

# Verify add-ons
heroku addons -a vulhub-leaderboard-api
```

---

## Environment Variables Configuration

### 1. API Application Environment Variables
```bash
# Set environment variables for the API app
heroku config:set NODE_ENV=production -a vulhub-leaderboard-api
heroku config:set API_PORT=3001 -a vulhub-leaderboard-api

# JWT Configuration
heroku config:set JWT_SECRET="your-production-jwt-secret-key-here" -a vulhub-leaderboard-api
heroku config:set JWT_EXPIRES_IN="1h" -a vulhub-leaderboard-api
heroku config:set REFRESH_TOKEN_SECRET="your-production-refresh-token-secret-here" -a vulhub-leaderboard-api
heroku config:set REFRESH_TOKEN_EXPIRES_IN="7d" -a vulhub-leaderboard-api

# CORS Configuration
heroku config:set CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-api

# Email Configuration (Optional)
heroku config:set EMAIL_SERVICE_HOST="smtp.sendgrid.net" -a vulhub-leaderboard-api
heroku config:set EMAIL_SERVICE_PORT="587" -a vulhub-leaderboard-api
heroku config:set EMAIL_SERVICE_USER="apikey" -a vulhub-leaderboard-api
heroku config:set EMAIL_SERVICE_PASSWORD="your-sendgrid-api-key" -a vulhub-leaderboard-api
heroku config:set EMAIL_FROM="noreply@vulhub.com" -a vulhub-leaderboard-api

# Storage Configuration (Optional)
heroku config:set STORAGE_ACCESS_KEY="your-s3-access-key" -a vulhub-leaderboard-api
heroku config:set STORAGE_SECRET_KEY="your-s3-secret-key" -a vulhub-leaderboard-api
heroku config:set STORAGE_ENDPOINT="https://your-s3-bucket.s3.amazonaws.com" -a vulhub-leaderboard-api
heroku config:set STORAGE_BUCKET="vulhub-evidence" -a vulhub-leaderboard-api
```

### 2. Web Application Environment Variables
```bash
# Set environment variables for the web app
heroku config:set NODE_ENV=production -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_API_URL="https://vulhub-leaderboard-api.herokuapp.com" -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_WS_URL="wss://vulhub-leaderboard-api.herokuapp.com" -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_APP_URL="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web
```

### 3. Verify Environment Variables
```bash
# Check API environment variables
heroku config -a vulhub-leaderboard-api

# Check web environment variables
heroku config -a vulhub-leaderboard-web
```

---

## Database Migration

### 1. Generate Prisma Client
```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or run migrations (for production)
npx prisma migrate deploy
```

### 2. Run Migrations on Heroku
```bash
# Run migrations on the API app
heroku run "cd apps/api && npx prisma migrate deploy" -a vulhub-leaderboard-api

# Verify database connection
heroku run "cd apps/api && npx prisma db seed" -a vulhub-leaderboard-api
```

### 3. Create Initial Data (Optional)
```bash
# Create a seed script in apps/api/prisma/seed.ts
# Then run it on Heroku
heroku run "cd apps/api && npx prisma db seed" -a vulhub-leaderboard-api
```

---

## Deployment Process

### 1. Deploy API Application
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"

# Deploy API to Heroku
git push heroku-api main

# Check deployment logs
heroku logs --tail -a vulhub-leaderboard-api
```

### 2. Deploy Web Application
```bash
# Deploy web app to Heroku
git push heroku-web main

# Check deployment logs
heroku logs --tail -a vulhub-leaderboard-web
```

### 3. Scale Applications (Optional)
```bash
# Scale API to handle more traffic
heroku ps:scale web=1 -a vulhub-leaderboard-api

# Scale web app
heroku ps:scale web=1 -a vulhub-leaderboard-web
```

---

## Post-Deployment Verification

### 1. Health Check API
```bash
# Test API health endpoint
curl https://vulhub-leaderboard-api.herokuapp.com/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2025-01-27T10:00:00.000Z",
#   "uptime": 123.456,
#   "environment": "production",
#   "version": "1.0.0",
#   "services": {
#     "database": { "status": "up", "responseTime": 12.34 },
#     "redis": { "status": "up", "responseTime": 5.67 }
#   }
# }
```

### 2. Test Web Application
```bash
# Open web application
open https://vulhub-leaderboard-web.herokuapp.com

# Verify all pages load correctly:
# - Home page
# - Login page
# - Register page
# - Dashboard (after login)
# - Leaderboard
```

### 3. Test API Endpoints
```bash
# Test authentication endpoints
curl -X POST https://vulhub-leaderboard-api.herokuapp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User","tenantId":"default"}'

# Test login
curl -X POST https://vulhub-leaderboard-api.herokuapp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Verify Database Connection
```bash
# Connect to Heroku database
heroku pg:psql -a vulhub-leaderboard-api

# Run some queries to verify data
SELECT * FROM "tenants" LIMIT 5;
SELECT * FROM "users" LIMIT 5;
SELECT * FROM "projects" LIMIT 5;
```

---

## Monitoring and Maintenance

### 1. Application Monitoring
```bash
# View application metrics
heroku ps -a vulhub-leaderboard-api
heroku ps -a vulhub-leaderboard-web

# Monitor logs
heroku logs --tail -a vulhub-leaderboard-api
heroku logs --tail -a vulhub-leaderboard-web
```

### 2. Database Monitoring
```bash
# Check database status
heroku pg:info -a vulhub-leaderboard-api

# Monitor database performance
heroku pg:outliers -a vulhub-leaderboard-api
```

### 3. Redis Monitoring
```bash
# Check Redis status
heroku redis:info -a vulhub-leaderboard-api

# Monitor Redis performance
heroku redis:cli -a vulhub-leaderboard-api
```

### 4. Regular Maintenance Tasks
```bash
# Update dependencies
pnpm update
git add package.json pnpm-lock.yaml
git commit -m "Update dependencies"
git push heroku-api main
git push heroku-web main

# Backup database
heroku pg:backups:capture -a vulhub-leaderboard-api

# Restart applications if needed
heroku restart -a vulhub-leaderboard-api
heroku restart -a vulhub-leaderboard-web
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
```bash
# Check build logs
heroku logs --tail -a vulhub-leaderboard-api

# Common fixes:
# - Ensure all dependencies are in package.json
# - Check Node.js version compatibility
# - Verify build scripts are correct
```

#### 2. Database Connection Issues
```bash
# Check database URL
heroku config:get DATABASE_URL -a vulhub-leaderboard-api

# Test database connection
heroku run "cd apps/api && npx prisma db push" -a vulhub-leaderboard-api
```

#### 3. Environment Variable Issues
```bash
# List all environment variables
heroku config -a vulhub-leaderboard-api

# Set missing variables
heroku config:set MISSING_VAR="value" -a vulhub-leaderboard-api
```

#### 4. CORS Issues
```bash
# Check CORS configuration
heroku config:get CORS_ORIGIN -a vulhub-leaderboard-api

# Update CORS origin
heroku config:set CORS_ORIGIN="https://your-domain.com" -a vulhub-leaderboard-api
```

#### 5. Memory Issues
```bash
# Check memory usage
heroku ps -a vulhub-leaderboard-api

# Scale up if needed
heroku ps:scale web=1:standard-1x -a vulhub-leaderboard-api
```

### Debug Commands
```bash
# Open a one-off dyno for debugging
heroku run bash -a vulhub-leaderboard-api

# Check application status
heroku ps:scale web=1 -a vulhub-leaderboard-api

# View detailed logs
heroku logs --source app -a vulhub-leaderboard-api
```

---

## Security Considerations

### 1. Environment Variables
- Never commit secrets to version control
- Use strong, unique secrets for production
- Rotate secrets regularly
- Use Heroku's config vars for sensitive data

### 2. Database Security
- Use SSL connections for database
- Implement proper access controls
- Regular backups
- Monitor for suspicious activity

### 3. Application Security
- Enable HTTPS for all communications
- Implement proper CORS policies
- Use secure JWT secrets
- Regular security updates

---

## Performance Optimization

### 1. Database Optimization
```bash
# Monitor database performance
heroku pg:outliers -a vulhub-leaderboard-api

# Add database indexes if needed
heroku run "cd apps/api && npx prisma db push" -a vulhub-leaderboard-api
```

### 2. Caching Strategy
- Use Redis for session storage
- Implement API response caching
- Use CDN for static assets

### 3. Scaling
```bash
# Scale horizontally
heroku ps:scale web=2 -a vulhub-leaderboard-api

# Upgrade to higher dyno types
heroku ps:scale web=1:standard-1x -a vulhub-leaderboard-api
```

---

## Backup and Recovery

### 1. Database Backups
```bash
# Create manual backup
heroku pg:backups:capture -a vulhub-leaderboard-api

# Schedule automatic backups
heroku pg:backups:schedule --at '02:00 America/Los_Angeles' -a vulhub-leaderboard-api

# List backups
heroku pg:backups -a vulhub-leaderboard-api
```

### 2. Restore from Backup
```bash
# Restore from backup
heroku pg:backups:restore b001 DATABASE_URL -a vulhub-leaderboard-api
```

---

## Cost Optimization

### 1. Free Tier Limitations
- Heroku free tier has limitations
- Consider upgrading for production use
- Monitor usage to avoid overages

### 2. Resource Management
```bash
# Check current usage
heroku ps -a vulhub-leaderboard-api

# Optimize dyno usage
heroku ps:scale web=0 -a vulhub-leaderboard-api  # Scale down when not needed
```

---

## Support and Resources

### 1. Documentation
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/recipes/deployment)

### 2. Community Support
- [Heroku Support](https://help.heroku.com/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/heroku)
- [GitHub Issues](https://github.com/your-repo/issues)

### 3. Monitoring Tools
- [Heroku Metrics](https://devcenter.heroku.com/articles/metrics)
- [New Relic](https://elements.heroku.com/addons/newrelic) (add-on)
- [Papertrail](https://elements.heroku.com/addons/papertrail) (logging add-on)

---

## Conclusion

This deployment guide provides comprehensive instructions for deploying the VulHub Leaderboard application to Heroku. Follow these steps carefully, and you'll have a production-ready application running in the cloud.

For additional support or questions, refer to the troubleshooting section or contact the development team.

**Happy Deploying! 🚀**
