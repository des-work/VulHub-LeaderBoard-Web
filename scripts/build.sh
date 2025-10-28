#!/bin/bash

# VulHub Build Script
# This script builds all packages and prepares for containerization

set -e

echo "🚀 Building VulHub Leaderboard..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_warning "Docker is not installed. Containerization will not be available."
fi

# Clean previous builds
print_status "Cleaning previous builds..."
pnpm clean

# Install dependencies
print_status "Installing dependencies..."
pnpm install

# Build packages in order
print_status "Building packages..."

# Build shared packages first
print_status "Building @vulhub/config..."
cd packages/config && pnpm build && cd ../..

print_status "Building @vulhub/schema..."
cd packages/schema && pnpm build && cd ../..

print_status "Building @vulhub/utils..."
cd packages/utils && pnpm build && cd ../..

print_status "Building @vulhub/ui..."
cd packages/ui && pnpm build && cd ../..

# Build applications
print_status "Building @vulhub/api..."
cd apps/api && pnpm build && cd ../..

print_status "Building @vulhub/web..."
cd apps/web && pnpm build && cd ../..

# Run type checking
print_status "Running type checks..."
pnpm type-check

# Run linting
print_status "Running linting..."
pnpm lint

print_success "All packages built successfully!"

# Check if Docker is available for containerization
if command -v docker &> /dev/null; then
    print_status "Docker is available. You can now run:"
    echo "  docker-compose up --build"
    echo "  or"
    echo "  docker build -t vulhub-web -f Dockerfile --target web-production ."
    echo "  docker build -t vulhub-api -f Dockerfile --target api-production ."
else
    print_warning "Docker is not available. Install Docker to enable containerization."
fi

print_success "Build completed successfully! 🎉"
