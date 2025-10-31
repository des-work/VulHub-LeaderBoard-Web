# Quick Start Guide - VulHub Leaderboard

**Last Updated:** October 31, 2025  
**Status:** ✅ Fully Working

---

## 🚀 Start Everything (2 Terminals)

### Terminal 1: Start API
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-api.ps1
```

Wait for: `🚀 Application is running on: http://localhost:4010`

### Terminal 2: Start Frontend
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-web.ps1
```

Wait for: `✓ Ready in XXXms`

### Terminal 3: Start Databases (If Not Running)
```powershell
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev
```

---

## 🌐 Access Application

- **Frontend:** http://localhost:3010
- **API Docs:** http://localhost:4010/api/docs
- **API Health:** http://localhost:4010/api/v1/health

---

## 🔑 Login Credentials

**All users:** Password is `admin123`

| Role | Email |
|------|-------|
| Admin | admin@vulhub.com |
| Instructor | instructor@vulhub.com |
| Student | student1@vulhub.com |

**Note:** Enter email in "School ID" field on login page.

---

## ✅ Verify It's Working

1. Open http://localhost:3010
2. Login with: `admin@vulhub.com` / `admin123`
3. Should redirect to dashboard
4. Check browser console (F12) - no errors

---

## 🐛 If Something Breaks

### API Won't Start
- Check environment variables are set
- Verify PostgreSQL and Redis are running
- Check port 4010 is available

### Frontend Won't Start
- Clear cache: `cd apps/web && rm -rf .next`
- Check port 3010 is available
- Verify `.env.local` exists with `NEXT_PUBLIC_API_URL`

### Login Fails
- Verify API is running: http://localhost:4010/api/v1/health
- Check browser console for specific error
- Verify credentials: `admin@vulhub.com` / `admin123`

### CORS Errors
- Restart API with correct `CORS_ORIGIN=http://localhost:3010`
- Check API is using environment variables

---

## 📝 Important Files

- `start-api.ps1` - Start API
- `start-web.ps1` - Start frontend
- `LOCAL_DEVELOPMENT_GUIDE.md` - Detailed guide
- `SUCCESS_LOGIN_WORKING.md` - Current status

---

## 🎯 Current State

✅ **Everything Working:**
- API responding
- Frontend loading
- Login successful
- User data flowing
- Ready for development

**Status:** Production-ready for development! 🎉

