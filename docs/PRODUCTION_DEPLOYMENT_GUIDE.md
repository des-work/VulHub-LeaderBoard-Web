# Production Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the VulHub Leaderboard application to production environments using Heroku with automated CI/CD pipelines.

## 🚀 Prerequisites

### Required Accounts
- **GitHub Account**: For code repository and CI/CD
- **Heroku Account**: For application hosting
- **Snyk Account**: For security scanning (optional)
- **Slack Account**: For deployment notifications (optional)

### Required Tools
- **Git**: Version control
- **Node.js**: v18 or higher
- **pnpm**: v8 or higher
- **Heroku CLI**: For manual deployments

## 🔧 Environment Setup

### 1. GitHub Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-username/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web

# Create and switch to main branch
git checkout -b main
git push -u origin main
```

### 2. Heroku App Creation
```bash
# Login to Heroku
heroku login

# Create staging app
heroku create vulhub-leaderboard-staging

# Create production app
heroku create vulhub-leaderboard-prod

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini --app vulhub-leaderboard-staging
heroku addons:create heroku-postgresql:standard-0 --app vulhub-leaderboard-prod

# Add Redis addon
heroku addons:create heroku-redis:mini --app vulhub-leaderboard-staging
heroku addons:create heroku-redis:premium-0 --app vulhub-leaderboard-prod
```

### 3. Environment Variables Setup
```bash
# Set staging environment variables
heroku config:set NODE_ENV=production --app vulhub-leaderboard-staging
heroku config:set JWT_SECRET=your-jwt-secret --app vulhub-leaderboard-staging
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret --app vulhub-leaderboard-staging
heroku config:set CORS_ORIGIN=https://vulhub-leaderboard-staging.herokuapp.com --app vulhub-leaderboard-staging

# Set production environment variables
heroku config:set NODE_ENV=production --app vulhub-leaderboard-prod
heroku config:set JWT_SECRET=your-production-jwt-secret --app vulhub-leaderboard-prod
heroku config:set JWT_REFRESH_SECRET=your-production-refresh-secret --app vulhub-leaderboard-prod
heroku config:set CORS_ORIGIN=https://vulhub-leaderboard-prod.herokuapp.com --app vulhub-leaderboard-prod
```

## 🔐 GitHub Secrets Configuration

### Required Secrets
Add the following secrets to your GitHub repository:

1. **HEROKU_API_KEY**: Your Heroku API key
2. **HEROKU_EMAIL**: Your Heroku account email
3. **HEROKU_STAGING_APP_NAME**: `vulhub-leaderboard-staging`
4. **HEROKU_PRODUCTION_APP_NAME**: `vulhub-leaderboard-prod`
5. **SNYK_TOKEN**: Your Snyk API token (optional)
6. **SLACK_WEBHOOK_URL**: Your Slack webhook URL (optional)

### How to Add Secrets
1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the appropriate value

## 📋 Deployment Process

### Automated Deployment
The CI/CD pipeline automatically deploys when:
- Code is pushed to the `main` branch
- Pull requests are merged to `main`
- Manual workflow dispatch is triggered

### Deployment Stages
1. **Code Quality Checks**: Linting, type checking, formatting
2. **Unit Tests**: Service layer testing
3. **Integration Tests**: API endpoint testing
4. **Build**: Application compilation
5. **Security Scan**: Vulnerability assessment
6. **Staging Deployment**: Deploy to staging environment
7. **Production Deployment**: Deploy to production environment

### Manual Deployment
```bash
# Deploy to staging
git push heroku main:staging

# Deploy to production
git push heroku main:production

# Run database migrations
heroku run pnpm db:migrate --app vulhub-leaderboard-staging
heroku run pnpm db:migrate --app vulhub-leaderboard-prod
```

## 🏥 Health Monitoring

### Health Check Endpoints
- **Staging**: `https://vulhub-leaderboard-staging.herokuapp.com/health`
- **Production**: `https://vulhub-leaderboard-prod.herokuapp.com/health`

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600000,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 45,
      "lastChecked": "2024-01-01T00:00:00.000Z"
    },
    "redis": {
      "status": "up",
      "responseTime": 12,
      "lastChecked": "2024-01-01T00:00:00.000Z"
    },
    "memory": {
      "status": "up",
      "responseTime": 5,
      "lastChecked": "2024-01-01T00:00:00.000Z"
    }
  },
  "metrics": {
    "responseTime": 150,
    "errorRate": 0.5,
    "requestCount": 1000,
    "activeConnections": 25
  }
}
```

## 📊 Monitoring & Alerting

### Monitoring Configuration
The application includes comprehensive monitoring:
- **Performance Metrics**: Response times, error rates, memory usage
- **Health Checks**: Database, Redis, memory, disk, API status
- **Alerting**: Configurable thresholds and notification channels
- **Dashboards**: Real-time monitoring dashboards
- **Reports**: Automated performance and security reports

### Alert Thresholds
- **Response Time**: > 2 seconds
- **Error Rate**: > 5%
- **Memory Usage**: > 80%
- **CPU Usage**: > 80%

### Notification Channels
- **Email**: Admin notifications
- **Slack**: Real-time alerts
- **Webhook**: Custom integrations

## 🔒 Security Considerations

### Security Features
- **HTTPS**: All traffic encrypted
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: API protection
- **Input Validation**: Request sanitization
- **Security Headers**: Helmet.js protection
- **Audit Logging**: Complete audit trail

### Security Scanning
- **Snyk**: Vulnerability scanning
- **npm audit**: Dependency security
- **CodeQL**: Static analysis
- **OWASP**: Security best practices

## 🚨 Troubleshooting

### Common Issues

#### Deployment Failures
```bash
# Check deployment logs
heroku logs --tail --app vulhub-leaderboard-staging

# Check build logs
heroku builds --app vulhub-leaderboard-staging
```

#### Database Issues
```bash
# Check database status
heroku pg:info --app vulhub-leaderboard-staging

# Run database diagnostics
heroku pg:diagnose --app vulhub-leaderboard-staging
```

#### Redis Issues
```bash
# Check Redis status
heroku redis:info --app vulhub-leaderboard-staging

# Monitor Redis
heroku redis:cli --app vulhub-leaderboard-staging
```

### Rollback Procedures
```bash
# Rollback to previous release
heroku releases:rollback --app vulhub-leaderboard-prod

# Rollback to specific release
heroku releases:rollback v123 --app vulhub-leaderboard-prod
```

## 📈 Performance Optimization

### Production Optimizations
- **Database Indexing**: Optimized queries
- **Redis Caching**: Response caching
- **CDN**: Static asset delivery
- **Compression**: Response compression
- **Connection Pooling**: Database optimization

### Scaling Considerations
- **Horizontal Scaling**: Multiple dynos
- **Database Scaling**: Read replicas
- **Cache Scaling**: Redis clustering
- **Load Balancing**: Traffic distribution

## 🔄 Maintenance

### Regular Maintenance Tasks
- **Database Backups**: Automated backups
- **Security Updates**: Dependency updates
- **Performance Monitoring**: Regular reviews
- **Log Rotation**: Log management
- **Health Checks**: Continuous monitoring

### Maintenance Schedule
- **Daily**: Health checks, log review
- **Weekly**: Performance reports, security scans
- **Monthly**: Dependency updates, backup verification
- **Quarterly**: Security audits, performance optimization

## 📞 Support

### Support Channels
- **Documentation**: Comprehensive guides
- **GitHub Issues**: Bug reports and feature requests
- **Email Support**: admin@vulhub.com
- **Slack**: #vulhub-support

### Emergency Procedures
- **Incident Response**: 24/7 monitoring
- **Escalation Process**: Defined escalation paths
- **Communication Plan**: Stakeholder notifications
- **Recovery Procedures**: Disaster recovery plans

## 🎯 Success Metrics

### Deployment Success Criteria
- **Zero Downtime**: Seamless deployments
- **Health Checks**: All systems operational
- **Performance**: Response times < 200ms
- **Security**: No critical vulnerabilities
- **Monitoring**: Full observability

### Quality Gates
- **Code Quality**: 100% linting, type checking
- **Test Coverage**: 95%+ coverage
- **Security**: No high-severity vulnerabilities
- **Performance**: Meets SLA requirements
- **Monitoring**: Full system visibility

## 🏆 Production Readiness Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security scans clean
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Monitoring configured
- [ ] Alerting configured

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Backup procedures tested
- [ ] Rollback procedures tested
- [ ] Support team notified

## 🚀 Next Steps

After successful deployment:
1. **Monitor**: Watch health checks and metrics
2. **Test**: Verify all functionality works
3. **Optimize**: Fine-tune performance
4. **Scale**: Add resources as needed
5. **Maintain**: Regular maintenance tasks

The application is now production-ready with enterprise-grade deployment, monitoring, and maintenance capabilities.
