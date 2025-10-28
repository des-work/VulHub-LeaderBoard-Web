#!/bin/bash

# VulHub Development Database Setup Script
# This script sets up the local development environment

set -e

echo "🚀 Setting up VulHub Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# VulHub Development Environment Configuration
NODE_ENV=development
PORT=4000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5432/vulhub_dev?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# Security
BCRYPT_ROUNDS=12
SESSION_SECRET="your-session-secret-change-this-in-production"

# Monitoring
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true

# Feature Flags
ENABLE_WEBSOCKETS=true
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_FILE_UPLOADS=true
ENABLE_AUDIT_LOGGING=true
ENABLE_METRICS=true
ENABLE_RATE_LIMITING=true
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file already exists"
fi

# Start database services
echo "🐘 Starting PostgreSQL and Redis..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is accessible
echo "🔍 Testing database connection..."
if docker exec vulhub-postgres pg_isready -U vulhub -d vulhub_dev > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready. Please check Docker logs."
    exit 1
fi

# Run Prisma migrations
echo "🔄 Running database migrations..."
cd apps/api
npx prisma migrate dev --name init
npx prisma generate

# Seed the database
echo "🌱 Seeding database with development data..."
npx prisma db seed

cd ../..

echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the API: pnpm --filter @vulhub/api dev"
echo "2. Start the Web App: pnpm --filter @vulhub/web dev"
echo "3. Visit http://localhost:3000 for the web application"
echo "4. Visit http://localhost:4000/api/docs for API documentation"
echo ""
echo "🗄️ Database Info:"
echo "- Host: localhost:5432"
echo "- Database: vulhub_dev"
echo "- Username: vulhub"
echo "- Password: vulhub123"
echo ""
echo "🔧 Useful commands:"
echo "- View database: docker exec -it vulhub-postgres psql -U vulhub -d vulhub_dev"
echo "- Reset database: docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up -d"
echo "- View logs: docker-compose -f docker-compose.dev.yml logs -f"
