# 🏗️ Infrastructure Configuration

This directory contains all infrastructure-related configurations for the VulHub Leaderboard project. Centralizing these files helps maintain a clean separation between application code and deployment/runtime environments.

## 📂 Directory Structure

```
infra/
├── docker-compose.dev.yml      # Docker Compose for local development (Postgres, Redis, etc.)
├── docker-compose.production.yml # Docker Compose for production simulation
├── prometheus/                 # Prometheus monitoring configuration
├── grafana/                    # Grafana dashboard and provisioning files
└── nginx/                      # Nginx reverse proxy configuration
```

## 🐳 Docker & Docker Compose

The Docker setup is managed via Docker Compose to orchestrate the multiple services required by the application.

### Development Environment

The `docker-compose.dev.yml` file defines the services needed for local development, such as the database and cache, without containerizing the applications themselves. This allows for hot-reloading and a faster development loop.

**To start the development infrastructure:**
```bash
# From the project root
pnpm dev:stack
```

This command will start PostgreSQL, Redis, MinIO, and MailHog.

### Production Environment

The `docker-compose.production.yml` file is configured to build and run the production-ready application containers (`api`, `web`, `worker`) along with all dependent services.

**To build and run the full production stack:**
```bash
# Navigate to the infra directory
cd infra

# Build and start all services
docker-compose -f docker-compose.production.yml up --build -d
```

This setup is ideal for simulating the production environment locally or for simple deployments.