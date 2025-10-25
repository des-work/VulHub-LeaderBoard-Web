# ⚡ Quick Deploy Guide - VulHub Leaderboard

Get your VulHub Leaderboard application deployed to Heroku in under 10 minutes!

## 🚀 One-Command Deployment

### For Windows (PowerShell)
```powershell
# Run the automated deployment script
.\scripts\deploy.ps1
```

### For macOS/Linux (Bash)
```bash
# Run the automated deployment script
./scripts/deploy.sh
```

## 📋 Prerequisites (5 minutes)

### 1. Install Required Software
```bash
# Install Node.js (v18.0.0+)
# Download from: https://nodejs.org

# Install pnpm
npm install -g pnpm

# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Install Git
# Download from: https://git-scm.com
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Clone Repository
```bash
git clone <your-repository-url>
cd VulHub-LeaderBoard-Web
```

## 🎯 Manual Deployment (Alternative)

If you prefer manual deployment or the script doesn't work:

### 1. Create Heroku Apps
```bash
# Create API app
heroku create vulhub-leaderboard-api

# Create Web app  
heroku create vulhub-leaderboard-web
```

### 2. Add Database & Redis
```bash
# Add PostgreSQL to API app
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-api

# Add Redis to API app
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-api
```

### 3. Set Environment Variables
```bash
# API Environment Variables
heroku config:set NODE_ENV=production -a vulhub-leaderboard-api
heroku config:set API_PORT=3001 -a vulhub-leaderboard-api
heroku config:set JWT_SECRET="your-secret-key-here" -a vulhub-leaderboard-api
heroku config:set JWT_EXPIRES_IN="1h" -a vulhub-leaderboard-api
heroku config:set REFRESH_TOKEN_SECRET="your-refresh-secret-here" -a vulhub-leaderboard-api
heroku config:set REFRESH_TOKEN_EXPIRES_IN="7d" -a vulhub-leaderboard-api
heroku config:set CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-api

# Web App Environment Variables
heroku config:set NODE_ENV=production -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_API_URL="https://vulhub-leaderboard-api.herokuapp.com" -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_WS_URL="wss://vulhub-leaderboard-api.herokuapp.com" -a vulhub-leaderboard-web
heroku config:set NEXT_PUBLIC_APP_URL="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web
```

### 4. Deploy Applications
```bash
# Build and deploy API
git push heroku-api main

# Run database migrations
heroku run "cd apps/api && npx prisma migrate deploy" -a vulhub-leaderboard-api

# Build and deploy Web app
git push heroku-web main
```

## ✅ Verify Deployment

### 1. Check API Health
```bash
curl https://vulhub-leaderboard-api.herokuapp.com/health
```

### 2. Open Web Application
```bash
# Open in browser
open https://vulhub-leaderboard-web.herokuapp.com
```

### 3. Test Key Features
- [ ] Home page loads
- [ ] Login page accessible
- [ ] Registration works
- [ ] Dashboard accessible
- [ ] Leaderboard displays

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check logs
heroku logs --tail -a vulhub-leaderboard-api
heroku logs --tail -a vulhub-leaderboard-web
```

#### Database Issues
```bash
# Check database status
heroku pg:info -a vulhub-leaderboard-api

# Run migrations manually
heroku run "cd apps/api && npx prisma migrate deploy" -a vulhub-leaderboard-api
```

#### Environment Variables
```bash
# Check all environment variables
heroku config -a vulhub-leaderboard-api
heroku config -a vulhub-leaderboard-web
```

## 📊 Post-Deployment

### Monitor Applications
```bash
# Check application status
heroku ps -a vulhub-leaderboard-api
heroku ps -a vulhub-leaderboard-web

# View logs
heroku logs --tail -a vulhub-leaderboard-api
heroku logs --tail -a vulhub-leaderboard-web
```

### Access Database
```bash
# Connect to database
heroku pg:psql -a vulhub-leaderboard-api

# Check tables
\dt
```

## 🎉 Success!

Your VulHub Leaderboard application is now live at:
- **Web App**: https://vulhub-leaderboard-web.herokuapp.com
- **API**: https://vulhub-leaderboard-api.herokuapp.com

## 📚 Next Steps

1. **Custom Domain** (Optional): Configure a custom domain in Heroku
2. **SSL Certificate**: Heroku provides free SSL certificates
3. **Monitoring**: Set up monitoring and alerting
4. **Backups**: Configure automatic database backups
5. **Scaling**: Scale your applications as needed

## 🆘 Need Help?

- Check the [Full Deployment Guide](DEPLOYMENT_GUIDE.md)
- Review the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- Contact the development team

**Happy Deploying! 🚀**
