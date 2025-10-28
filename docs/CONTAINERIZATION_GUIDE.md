# VulHub Leaderboard - Containerization Guide

This guide covers how to containerize and deploy the VulHub Leaderboard application using Docker.

## 🐳 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and pnpm (for local development)
- Git

### Development Environment

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd VulHub-LeaderBoard-Web
   pnpm install
   ```

2. **Start development services:**
   ```bash
   # Start database and Redis
   pnpm dev:stack
   
   # Run database migrations
   pnpm db:migrate
   
   # Seed the database
   pnpm db:seed
   
   # Start development servers
   pnpm dev
   ```

### Production Deployment

1. **Build and deploy with Docker Compose:**
   ```bash
   # First, ensure you have an infra/.env file with your production secrets.
   cp infra/.env.example infra/.env

   # Build and start all services from the project root
   pnpm prod:stack
   
   # View logs
   pnpm prod:stack:down && pnpm prod:stack && docker compose -f infra/docker-compose.production.yml logs -f
   ```

2. **Access the application:**
   - Web App: http://localhost:3000
   - API: http://localhost:4000
   - API Docs: http://localhost:4000/api/docs
   - Health Check: http://localhost:4000/health

## 🏗️ Architecture

The application consists of several services:

- **Web App** (`@vulhub/web`): Next.js frontend application
- **API** (`@vulhub/api`): NestJS backend API
- **Worker** (`@vulhub/worker`): Background job processor
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage

## 📦 Package Structure

```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── packages/
│   └── ...           # Shared packages
├── infra/
│   ├── docker-compose.dev.yml
│   ├── docker-compose.production.yml
│   └── .env.example
└── scripts/
    └── ...
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://vulhub:vulhub123@localhost:5432/vulhub_dev

# JWT Secrets (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# API Configuration
PORT=4000
CORS_ORIGIN=http://localhost:3000

# Web App Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Docker Configuration

The `docker-compose.yml` file defines all services:

- **postgres**: PostgreSQL 15 database
- **redis**: Redis 7 cache
- **api**: NestJS API service
- **web**: Next.js web application

## 🚀 Build Process

### Manual Build

1. **Build all packages:**
   ```bash
   pnpm build
   ```

2. **Build Docker images:**
   ```bash
   # Build web app
   docker build -t vulhub-web -f Dockerfile --target web-production .
   
   # Build API
   docker build -t vulhub-api -f Dockerfile --target api-production .
   ```

### Automated Build

Use the provided build scripts:

```bash
# Linux/Mac
./scripts/build.sh

# Windows
scripts\build.bat
```

## 🔍 Development

### Local Development

1. **Start infrastructure:**
   ```bash
   pnpm dev:stack
   ```

2. **Start applications:**
   ```bash
   # Terminal 1 - API
   cd apps/api && pnpm start:dev
   
   # Terminal 2 - Web
   cd apps/web && pnpm dev
   ```

### Database Management

```bash
# Run migrations
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

## 🐳 Docker Commands

### Basic Commands

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api
```

### Service Management

```bash
# Start specific service
docker-compose up -d postgres

# Restart service
docker-compose restart api

# Scale service
docker-compose up -d --scale api=2
```

### Database Operations

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U vulhub -d vulhub

# Access Redis
docker-compose exec redis redis-cli

# Run database migrations
docker-compose exec api pnpm prisma migrate deploy
```

## 🔒 Security Considerations

### Production Security

1. **Change default passwords:**
   - Update `POSTGRES_PASSWORD`
   - Update `JWT_SECRET` and `JWT_REFRESH_SECRET`

2. **Use environment files:**
   - Create `.env.production` with secure values
   - Never commit secrets to version control

3. **Network security:**
   - Use internal Docker networks
   - Expose only necessary ports
   - Configure proper CORS origins

### Environment Variables

Required for production:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_REFRESH_SECRET`: JWT refresh secret
- `REDIS_HOST`: Redis server host
- `CORS_ORIGIN`: Allowed CORS origins

## 📊 Monitoring

### Health Checks

All services include health checks:

- **API**: `GET /health`
- **Web**: `GET /`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`

### Logging

View logs for debugging:

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail=100 api
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts:**
   ```bash
   # Check port usage
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :4000
   ```

2. **Database connection issues:**
   ```bash
   # Check PostgreSQL status
   docker-compose exec postgres pg_isready -U vulhub
   ```

3. **Build failures:**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker-compose build --no-cache
   ```

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=vulhub:*

# Start with debug
docker-compose up
```

## 📈 Performance

### Optimization Tips

1. **Use multi-stage builds** (already configured)
2. **Enable Docker layer caching**
3. **Use production dependencies only**
4. **Configure proper resource limits**

### Resource Limits

Add to `docker-compose.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

## 🔄 CI/CD Integration

### GitHub Actions

Example workflow:

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker images
        run: docker-compose build
      - name: Run tests
        run: docker-compose run api pnpm test
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
