# 🚀 **Local Development Setup - VulHub Leaderboard**

**Date**: January 27, 2025  
**Status**: ✅ **READY** - Local development environment setup  
**Priority**: **HIGH** - Get the application running locally

---

## 🛠️ **Quick Local Setup**

### **Option 1: Full Development Environment (Recommended)**

#### **Prerequisites**
- [ ] Docker Desktop installed and running
- [ ] Node.js 18+ installed
- [ ] pnpm installed

#### **Step 1: Start Infrastructure Services**
```bash
# Start database, Redis, and other services
pnpm dev:stack
```

#### **Step 2: Run Database Migrations**
```bash
# Set up the database
pnpm db:migrate
```

#### **Step 3: Start All Applications**
```bash
# Start web app, API, and worker
pnpm dev
```

#### **Access Points**
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database Studio**: http://localhost:5555
- **Storybook**: http://localhost:6006

---

### **Option 2: Web App Only (Quick Test)**

If Docker isn't available, you can run just the web application:

#### **Step 1: Start Web App**
```bash
cd apps/web
pnpm dev
```

#### **Step 2: Access Web App**
- **Web App**: http://localhost:3000

**Note**: This will show the UI but won't have backend functionality without the API running.

---

### **Option 3: API Only (Backend Testing)**

To test just the API:

#### **Step 1: Start API**
```bash
cd apps/api
pnpm dev
```

#### **Step 2: Access API**
- **API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health

---

## 🔧 **Troubleshooting**

### **Docker Issues**
If Docker Desktop isn't running:
```bash
# Start Docker Desktop first, then:
pnpm dev:stack
```

### **Database Issues**
If database connection fails:
```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### **Port Conflicts**
If ports are already in use:
- **3000**: Web app port
- **3001**: API port
- **5555**: Prisma Studio port
- **6006**: Storybook port

Change ports in respective `package.json` files if needed.

---

## 📊 **What You'll See**

### **Web Application (http://localhost:3000)**
- ✅ **Login Page**: User authentication
- ✅ **Register Page**: User registration
- ✅ **Dashboard**: User statistics and progress
- ✅ **Leaderboard**: Real-time rankings
- ✅ **Projects**: VulHub project listings

### **API (http://localhost:3001)**
- ✅ **Health Check**: `/api/health`
- ✅ **API Documentation**: `/api/docs`
- ✅ **Authentication**: `/api/auth/*`
- ✅ **Users**: `/api/users/*`
- ✅ **Projects**: `/api/projects/*`
- ✅ **Submissions**: `/api/submissions/*`
- ✅ **Leaderboards**: `/api/leaderboards/*`
- ✅ **Badges**: `/api/badges/*`

### **Database Studio (http://localhost:5555)**
- ✅ **Visual Database Editor**: Browse and edit data
- ✅ **Query Interface**: Run SQL queries
- ✅ **Data Management**: Add, edit, delete records

---

## 🎯 **Testing the Application**

### **1. User Registration**
1. Go to http://localhost:3000/register
2. Fill out the registration form
3. Submit and verify account creation

### **2. User Login**
1. Go to http://localhost:3000/login
2. Enter credentials
3. Verify successful login

### **3. Dashboard**
1. After login, you'll see the dashboard
2. Check user statistics and progress
3. Verify data is loading correctly

### **4. Leaderboard**
1. Navigate to the leaderboard page
2. Check if rankings are displayed
3. Verify real-time updates (if WebSocket is working)

### **5. API Testing**
1. Go to http://localhost:3001/api/docs
2. Test API endpoints
3. Verify authentication flow

---

## 🚀 **Next Steps**

Once you have the local environment running:

1. **Test All Features**: Navigate through all pages
2. **Check API Endpoints**: Test backend functionality
3. **Verify Database**: Check data persistence
4. **Test Real-time Features**: WebSocket connections
5. **Prepare for Deployment**: Ready for Heroku deployment

---

## 📞 **Support**

If you encounter issues:
1. **Check Logs**: Look at terminal output for errors
2. **Verify Dependencies**: Ensure all packages are installed
3. **Check Ports**: Make sure ports aren't in use
4. **Docker Status**: Ensure Docker Desktop is running

---

*Local Development Setup Guide completed on January 27, 2025. Follow these steps to get the application running locally.*
