# 🚀 **Local Development Setup - VulHub Leaderboard**

**Date**: January 27, 2025  
**Status**: ✅ **READY** - Local development environment setup with enhanced code quality  
**Priority**: **HIGH** - Get the application running locally with enterprise-grade features

---

## 🛠️ **Quick Local Setup**

### **Option 1: Full Development Environment (Recommended)**

#### **Prerequisites**
- [ ] Docker Desktop installed and running
- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Git installed

#### **Step 1: Clone and Install Dependencies**
```bash
# Clone the repository
git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web

# Install all dependencies
pnpm install
```

#### **Step 2: Start Infrastructure Services**
```bash
# Start database, Redis, and other services
pnpm dev:stack
```

#### **Step 3: Run Database Migrations**
```bash
# Set up the database
pnpm db:migrate

# Seed the database with sample data
pnpm db:seed
```

#### **Step 4: Start All Applications**
```bash
# Start web app, API, and worker
pnpm dev
```

#### **Access Points**
- **Web App**: http://localhost:3000
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **API Health**: http://localhost:4000/health
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
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/health
- **Test Endpoint**: http://localhost:4000/test

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

# Seed database
pnpm db:seed
```

### **Port Conflicts**
If ports are already in use:
- **3000**: Web app port
- **4000**: API port
- **5555**: Prisma Studio port
- **6006**: Storybook port

Change ports in respective `package.json` files if needed.

### **API Connection Issues**
If the API fails to start:
```bash
# Check if port 4000 is available
netstat -ano | findstr :4000

# Kill process using port 4000 (Windows)
taskkill /PID <PID> /F

# Kill process using port 4000 (Unix)
kill -9 <PID>
```

---

## 📊 **What You'll See**

### **Web Application (http://localhost:3000)**
- ✅ **Landing Page**: Beautiful homepage with features overview
- ✅ **Login Page**: User authentication with form validation
- ✅ **Register Page**: User registration with institution selection
- ✅ **Dashboard**: User statistics and progress tracking
- ✅ **Leaderboard**: Real-time rankings with search and filtering
- ✅ **Projects**: VulHub project listings (when API is connected)

### **API (http://localhost:4000)**
- ✅ **Health Check**: `/health` - System health status
- ✅ **Test Endpoint**: `/test` - Basic API functionality test
- ✅ **API Documentation**: `/api/docs` - Swagger/OpenAPI documentation
- ✅ **Authentication**: `/api/v1/auth/*` - Login, register, refresh, logout
- ✅ **Users**: `/api/v1/users/*` - User management and profiles
- ✅ **Projects**: `/api/v1/projects/*` - Project CRUD and search
- ✅ **Submissions**: `/api/v1/submissions/*` - Submission management
- ✅ **Leaderboards**: `/api/v1/leaderboards/*` - Real-time rankings
- ✅ **Badges**: `/api/v1/badges/*` - Achievement system

### **Database Studio (http://localhost:5555)**
- ✅ **Visual Database Editor**: Browse and edit data
- ✅ **Query Interface**: Run SQL queries
- ✅ **Data Management**: Add, edit, delete records
- ✅ **Schema Visualization**: View database relationships

---

## 🎯 **Testing the Application**

### **1. API Health Check**
1. Go to http://localhost:4000/health
2. Verify API is running and healthy
3. Check database and Redis connections

### **2. API Test Endpoint**
1. Go to http://localhost:4000/test
2. Verify basic API functionality
3. Check response format

### **3. User Registration**
1. Go to http://localhost:3000/register
2. Fill out the registration form
3. Submit and verify account creation
4. Check database for new user record

### **4. User Login**
1. Go to http://localhost:3000/login
2. Enter credentials from registration
3. Verify successful login and redirect
4. Check JWT token in browser storage

### **5. Dashboard**
1. After login, you'll see the dashboard
2. Check user statistics and progress
3. Verify data is loading correctly
4. Test responsive design on different screen sizes

### **6. Leaderboard**
1. Navigate to the leaderboard page
2. Check if rankings are displayed
3. Test search and filtering functionality
4. Verify real-time updates (if WebSocket is working)

### **7. API Documentation**
1. Go to http://localhost:4000/api/docs
2. Test API endpoints interactively
3. Verify authentication flow
4. Test CRUD operations

### **8. Enhanced Features Testing**
1. **Error Handling**: Test error scenarios and recovery
2. **Form Validation**: Test client-side validation
3. **Loading States**: Check skeleton screens and spinners
4. **Responsive Design**: Test on different screen sizes
5. **Dark Mode**: Toggle between light and dark themes

---

## 🚀 **Enhanced Features Available**

### **Resilience Features**
- **Circuit Breaker Protection**: API automatically handles external service failures
- **Retry Logic**: Automatic retry for transient failures
- **Error Recovery**: Graceful error handling and user feedback
- **Performance Monitoring**: Real-time performance metrics

### **Security Features**
- **Input Validation**: Comprehensive validation and sanitization
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protection against abuse and DoS attacks
- **Audit Logging**: Complete operation logging for compliance

### **User Experience Features**
- **Loading States**: Skeleton screens and progress indicators
- **Error Boundaries**: Graceful error handling with fallback UI
- **Real-time Updates**: WebSocket integration for live data
- **Responsive Design**: Mobile-first approach with dark mode

### **Developer Experience Features**
- **TypeScript**: Full type safety across all packages
- **Hot Reload**: Fast development iteration
- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Real-time metrics and optimization

---

## 🎯 **Testing Enhanced Features**

### **1. Circuit Breaker Testing**
1. Stop the database service
2. Try to access API endpoints
3. Verify graceful degradation
4. Restart database and check recovery

### **2. Error Handling Testing**
1. Submit invalid form data
2. Check error messages and validation
3. Test network failures
4. Verify error recovery mechanisms

### **3. Performance Testing**
1. Monitor API response times
2. Check caching behavior
3. Test with multiple concurrent users
4. Verify performance metrics

### **4. Security Testing**
1. Test input validation
2. Check authentication flow
3. Verify rate limiting
4. Test XSS protection

---

## 🚀 **Next Steps**

Once you have the local environment running:

1. **Test All Features**: Navigate through all pages and test functionality
2. **Check API Endpoints**: Test backend functionality and resilience
3. **Verify Database**: Check data persistence and relationships
4. **Test Real-time Features**: WebSocket connections and updates
5. **Performance Testing**: Check response times and optimization
6. **Security Testing**: Verify authentication and validation
7. **Prepare for Deployment**: Ready for production deployment

---

## 📞 **Support**

If you encounter issues:

1. **Check Logs**: Look at terminal output for errors
2. **Verify Dependencies**: Ensure all packages are installed
3. **Check Ports**: Make sure ports aren't in use
4. **Docker Status**: Ensure Docker Desktop is running
5. **Database Connection**: Verify database is accessible
6. **API Health**: Check API health endpoint
7. **Error Messages**: Look for specific error messages in console

### **Common Issues and Solutions**

#### **Port Already in Use**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Unix
lsof -ti:4000 | xargs kill -9
```

#### **Database Connection Failed**
```bash
# Check if Docker is running
docker ps

# Restart database
pnpm dev:stack
```

#### **API Not Starting**
```bash
# Check environment variables
cat apps/api/.env

# Regenerate Prisma client
pnpm db:generate
```

---

## 🎉 **Success Indicators**

You'll know everything is working when:

✅ **Web App loads** at http://localhost:3000  
✅ **API responds** at http://localhost:4000/health  
✅ **Database accessible** at http://localhost:5555  
✅ **User registration** works without errors  
✅ **User login** redirects to dashboard  
✅ **Dashboard shows** user statistics  
✅ **Leaderboard displays** rankings  
✅ **API docs** accessible at http://localhost:4000/api/docs  
✅ **Real-time features** work (WebSocket connections)  
✅ **Error handling** works gracefully  
✅ **Performance** is responsive and fast  

---

*Local Development Setup Guide completed on January 27, 2025. Follow these steps to get the application running locally with enterprise-grade features and enhanced code quality.*