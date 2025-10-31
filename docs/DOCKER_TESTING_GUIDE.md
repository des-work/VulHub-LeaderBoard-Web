# 🐳 Docker Testing Guide - VulHub Leaderboard

## 📋 Overview

This guide provides step-by-step instructions for launching the VulHub Leaderboard website using Docker for local testing. The project includes comprehensive Docker configurations for both development and production environments.

## 🚀 Quick Start

### Prerequisites

- **Docker Desktop** installed and running
- **Git** for cloning the repository
- **Terminal/Command Prompt** access

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
```

### 2. Environment Setup

Create a `.env` file from the example:

```bash
cp env.example .env
```

Edit `.env` with your preferred settings (defaults work for local testing):

```env
# Database Configuration
POSTGRES_DB=vulhub_dev
POSTGRES_USER=vulhub
POSTGRES_PASSWORD=vulhub123

# JWT Configuration
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production

# API Configuration
NODE_ENV=development
PORT=4000
API_URL=http://api-dev:4000/api/v1

# Web Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Redis Configuration
REDIS_URL=redis://redis-dev:6379
```

## 🛠 Launch Options

### Option 1: Development Environment (Recommended)

**Best for**: Testing, development, and seeing live changes

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**What starts:**
- 🐘 PostgreSQL Database (port 5433)
- 🔴 Redis Cache (port 6380)
- 🚀 API Service (port 4000) with hot-reloading
- 🌐 Web Application (port 4010) with hot-reloading

**Access URLs:**
- **Website**: http://localhost:4010
- **API Health**: http://localhost:4000/api/v1/health
- **Database**: localhost:5433
- **Redis**: localhost:6380

### Option 2: Production Environment

**Best for**: Testing production builds and performance

```bash
docker-compose -f docker-compose.yml up --build
```

**What starts:**
- 🐘 PostgreSQL Database (port 5432)
- 🔴 Redis Cache (port 6379)
- 🚀 API Service (port 4000) - optimized build
- 🌐 Web Application (port 4010) - optimized build

**Access URLs:**
- **Website**: http://localhost:4010
- **API Health**: http://localhost:4000/api/v1/health

### Option 3: Infrastructure Only

**Best for**: Running web/API locally while using containerized database

```bash
docker-compose -f docker-compose.dev.yml up postgres-dev redis-dev
```

Then run locally:
```bash
# Terminal 1: Start API
cd apps/api && pnpm dev

# Terminal 2: Start Web App
cd apps/web && pnpm dev
```

## 🎯 Testing the Unified Design System

Once the website loads at **http://localhost:4010**, you can test our unified design system:

### 1. **Live Customization Panel**
- Click the **"Customize"** button in the header
- Test real-time color changes
- Toggle visual effects (glow, neon, gradient, shadows)
- Adjust typography settings
- Modify layout spacing and border radius

### 2. **Intelligent Components**
- **UnifiedIcon**: Icons automatically adapt to selected style
- **Terminology**: Text transforms based on terminology setting
- **VisualEffect**: Components respond to effect configuration

### 3. **Responsive Design**
- Test on different screen sizes
- Verify mobile responsiveness
- Check accessibility features

## 🔧 Docker Configuration Details

### Development Environment (`docker-compose.dev.yml`)

```yaml
services:
  postgres-dev:
    image: postgres:15-alpine
    ports: ["5433:5432"]
    environment:
      POSTGRES_DB: vulhub_dev
      POSTGRES_USER: vulhub
      POSTGRES_PASSWORD: vulhub123

  redis-dev:
    image: redis:7-alpine
    ports: ["6380:6379"]

  api-dev:
    build: { context: ., dockerfile: Dockerfile, target: base }
    ports: ["4000:4000"]
    volumes:
      - ./apps/api:/usr/src/app/apps/api
      - ./packages:/usr/src/app/packages
    command: ["pnpm", "dev"]

  web-dev:
    build: { context: ., dockerfile: Dockerfile, target: base }
    ports: ["4010:3000"]
    volumes:
      - ./apps/web:/usr/src/app/apps/web
      - ./packages:/usr/src/app/packages
    command: ["pnpm", "dev"]
```

### Production Environment (`docker-compose.yml`)

```yaml
services:
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: vulhub
      POSTGRES_USER: vulhub
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-vulhub123}

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  api:
    build: { context: ., dockerfile: Dockerfile, target: api-production }
    ports: ["4000:4000"]
    command: ["sh", "-c", "cd apps/api && pnpm start"]

  web:
    build: { context: ., dockerfile: Dockerfile, target: web-production }
    ports: ["4010:3000"]
    command: ["sh", "-c", "cd apps/web && pnpm start"]
```

## 📊 Health Checks & Monitoring

### Container Health Checks

All services include health checks:

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f web-dev
docker-compose logs -f api-dev

# Check specific service health
docker-compose exec api-dev curl http://localhost:4000/api/v1/health
```

### Database Connection Test

```bash
# Connect to PostgreSQL
docker-compose exec postgres-dev psql -U vulhub -d vulhub_dev

# Test Redis connection
docker-compose exec redis-dev redis-cli ping
```

## 🛠 Troubleshooting

### Common Issues

#### 1. **Port Conflicts**
```bash
# Check what's using ports
netstat -tulpn | grep :4010
netstat -tulpn | grep :4000

# Use different ports in docker-compose.yml
ports:
  - "4011:3000"  # Change external port
```

#### 2. **Build Failures**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker-compose config
```

#### 3. **Database Connection Issues**
```bash
# Reset database
docker-compose down -v
docker-compose up postgres-dev

# Check database logs
docker-compose logs postgres-dev
```

#### 4. **Permission Issues (Linux/Mac)**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Debug Commands

```bash
# Enter running container
docker-compose exec web-dev sh
docker-compose exec api-dev sh

# View container resource usage
docker stats

# Clean up everything
docker-compose down -v --remove-orphans
docker system prune -a
```

## 🎨 Testing the Unified Design System Features

### 1. **Color Customization**
- Open customization panel
- Change primary, secondary, accent colors
- Verify instant visual updates
- Test color combinations

### 2. **Visual Effects**
- Toggle glow effects
- Enable neon styling
- Test gradient backgrounds
- Verify shadow effects

### 3. **Typography**
- Switch font families (modern, monospace, serif)
- Adjust font sizes
- Change font weights
- Test responsive typography

### 4. **Layout Settings**
- Adjust spacing (compact, comfortable, spacious)
- Change border radius (none, subtle, rounded, pill)
- Test density settings

### 5. **Element Styles**
- Switch icon styles (modern, medieval, cyberpunk, terminal)
- Change terminology (standard, medieval, hacker, cyberpunk)
- Test background styles (solid, gradient, pattern, animated)

## 📱 Mobile Testing

### Using Browser DevTools
1. Open http://localhost:4010
2. Press F12 to open DevTools
3. Click device toggle icon
4. Test responsive design
5. Verify touch interactions

### Using Physical Device
1. Find your computer's IP address
2. Access http://YOUR_IP:4010
3. Test on mobile device
4. Verify responsive behavior

## 🔄 Development Workflow

### Making Changes

1. **Edit source code** in your IDE
2. **Changes auto-reload** in development mode
3. **Test immediately** in browser
4. **Commit changes** when satisfied

### Hot Reloading Features

- **API changes**: Automatically restart API service
- **Web changes**: Instant browser refresh
- **Package changes**: Rebuild affected services
- **Database changes**: Persist across restarts

## 📈 Performance Testing

### Load Testing
```bash
# Install k6 (if available)
npm install -g k6

# Run load test
k6 run scripts/load-test.js
```

### Monitoring
```bash
# Monitor resource usage
docker stats

# Check application logs
docker-compose logs -f --tail=100
```

## 🚀 Production Deployment

### Build Production Images
```bash
# Build optimized images
docker-compose -f docker-compose.yml build

# Run production environment
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production
```env
NODE_ENV=production
POSTGRES_PASSWORD=your-secure-password
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

## 📚 Additional Resources

### Documentation
- [Unified Design System Guide](packages/ui/README.md)
- [API Documentation](apps/api/README.md)
- [Project Status](docs/PROJECT_STATUS.md)

### Useful Commands
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View service status
docker-compose ps

# Follow logs
docker-compose logs -f

# Restart specific service
docker-compose restart web-dev
```

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ **Website loads** at http://localhost:4010
- ✅ **API responds** at http://localhost:4000/api/v1/health
- ✅ **Customization panel** opens and functions
- ✅ **Live updates** work in real-time
- ✅ **Responsive design** works on mobile
- ✅ **All components** render correctly
- ✅ **No console errors** in browser
- ✅ **Database connection** successful

## 🤝 Contributing

If you encounter issues or have improvements:

1. **Check existing issues** on GitHub
2. **Create new issue** with detailed description
3. **Include logs** and error messages
4. **Specify environment** (OS, Docker version, etc.)

---

**Happy Testing!** 🚀

The unified design system provides an excellent foundation for testing and development. The Docker setup ensures consistent environments across different machines and operating systems.






