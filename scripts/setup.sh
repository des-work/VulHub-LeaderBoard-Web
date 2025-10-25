#!/bin/bash

# VulHub Leaderboard Setup Script
# This script sets up the development environment for the VulHub Leaderboard project

set -e

echo "🚀 Setting up VulHub Leaderboard development environment..."

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    # Check PNPM
    if ! command -v pnpm &> /dev/null; then
        print_warning "PNPM is not installed. Installing PNPM..."
        npm install -g pnpm
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker from https://docker.com/"
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose from https://docs.docker.com/compose/install/"
        exit 1
    fi
    
    print_success "All requirements satisfied!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install
    print_success "Dependencies installed!"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        cp infra/env.example .env
        print_success "Environment file created from template!"
        print_warning "Please review and update .env file with your configuration"
    else
        print_warning "Environment file already exists, skipping..."
    fi
}

# Start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start Docker services
    docker-compose -f infra/docker-compose.dev.yml up -d
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose -f infra/docker-compose.dev.yml ps | grep -q "Up"; then
        print_success "Infrastructure services started!"
    else
        print_error "Failed to start infrastructure services"
        exit 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Generate Prisma client
    cd prisma && pnpm generate && cd ..
    
    # Run migrations
    pnpm db:migrate
    
    # Seed database
    pnpm db:seed
    
    print_success "Database setup complete!"
}

# Build packages
build_packages() {
    print_status "Building packages..."
    pnpm build
    print_success "Packages built successfully!"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    pnpm test
    print_success "Tests passed!"
}

# Main setup function
main() {
    echo "🏰 VulHub Leaderboard Setup"
    echo "=========================="
    echo ""
    
    check_requirements
    install_dependencies
    setup_environment
    start_infrastructure
    setup_database
    build_packages
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Review and update .env file if needed"
    echo "2. Run 'pnpm dev' to start development servers"
    echo "3. Visit http://localhost:3000 for the web app"
    echo "4. Visit http://localhost:4000/api/health for the API"
    echo "5. Visit http://localhost:5555 for Prisma Studio"
    echo "6. Visit http://localhost:8025 for MailHog"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"
