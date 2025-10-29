#!/bin/bash

# Docker build script for VulHub Leaderboard
# This script builds Docker images for both API and Web applications

set -e

echo "🐳 Building VulHub Leaderboard Docker Images..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Build API image
print_status "Building API image..."
docker build --target api-production -t vulhub-api:latest .

if [ $? -eq 0 ]; then
    print_status "✅ API image built successfully"
else
    print_error "❌ Failed to build API image"
    exit 1
fi

# Build Web image
print_status "Building Web image..."
docker build --target web-production -t vulhub-web:latest .

if [ $? -eq 0 ]; then
    print_status "✅ Web image built successfully"
else
    print_error "❌ Failed to build Web image"
    exit 1
fi

# Build base image for development
print_status "Building base image for development..."
docker build --target base -t vulhub-base:latest .

if [ $? -eq 0 ]; then
    print_status "✅ Base image built successfully"
else
    print_error "❌ Failed to build base image"
    exit 1
fi

print_status "🎉 All Docker images built successfully!"
print_status "Available images:"
docker images | grep vulhub

echo ""
print_status "Next steps:"
echo "  Development: docker-compose -f docker-compose.dev.yml up"
echo "  Production:  docker-compose -f docker-compose.production.yml up"
echo "  Default:     docker-compose up"
