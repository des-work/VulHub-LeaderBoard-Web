#!/bin/bash

# VulHub Leaderboard - Automated Deployment Script
# This script automates the deployment process to Heroku

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_APP_NAME="vulhub-leaderboard-api"
WEB_APP_NAME="vulhub-leaderboard-web"
BRANCH="main"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists heroku; then
        print_error "Heroku CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists pnpm; then
        print_error "pnpm is not installed. Please install it first."
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install it first."
        exit 1
    fi
    
    # Check if logged in to Heroku
    if ! heroku auth:whoami >/dev/null 2>&1; then
        print_error "Not logged in to Heroku. Please run 'heroku login' first."
        exit 1
    fi
    
    print_success "All prerequisites met!"
}

# Function to build the application
build_application() {
    print_status "Building application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    pnpm install
    
    # Build all packages
    print_status "Building all packages..."
    pnpm build
    
    # Type check
    print_status "Running type checks..."
    pnpm type-check
    
    print_success "Application built successfully!"
}

# Function to create Heroku apps if they don't exist
create_heroku_apps() {
    print_status "Checking Heroku applications..."
    
    # Check if API app exists
    if ! heroku apps:info $API_APP_NAME >/dev/null 2>&1; then
        print_status "Creating API application: $API_APP_NAME"
        heroku create $API_APP_NAME
    else
        print_success "API application already exists: $API_APP_NAME"
    fi
    
    # Check if Web app exists
    if ! heroku apps:info $WEB_APP_NAME >/dev/null 2>&1; then
        print_status "Creating Web application: $WEB_APP_NAME"
        heroku create $WEB_APP_NAME
    else
        print_success "Web application already exists: $WEB_APP_NAME"
    fi
}

# Function to configure Heroku apps
configure_heroku_apps() {
    print_status "Configuring Heroku applications..."
    
    # Configure API app
    print_status "Configuring API application..."
    heroku buildpacks:set heroku/nodejs -a $API_APP_NAME
    
    # Add PostgreSQL add-on
    if ! heroku addons:info heroku-postgresql -a $API_APP_NAME >/dev/null 2>&1; then
        print_status "Adding PostgreSQL add-on..."
        heroku addons:create heroku-postgresql:mini -a $API_APP_NAME
    else
        print_success "PostgreSQL add-on already exists"
    fi
    
    # Add Redis add-on
    if ! heroku addons:info heroku-redis -a $API_APP_NAME >/dev/null 2>&1; then
        print_status "Adding Redis add-on..."
        heroku addons:create heroku-redis:mini -a $API_APP_NAME
    else
        print_success "Redis add-on already exists"
    fi
    
    # Configure Web app
    print_status "Configuring Web application..."
    heroku buildpacks:set heroku/nodejs -a $WEB_APP_NAME
}

# Function to set environment variables
set_environment_variables() {
    print_status "Setting environment variables..."
    
    # API environment variables
    print_status "Setting API environment variables..."
    heroku config:set NODE_ENV=production -a $API_APP_NAME
    heroku config:set API_PORT=3001 -a $API_APP_NAME
    heroku config:set JWT_SECRET="$(openssl rand -base64 32)" -a $API_APP_NAME
    heroku config:set JWT_EXPIRES_IN="1h" -a $API_APP_NAME
    heroku config:set REFRESH_TOKEN_SECRET="$(openssl rand -base64 32)" -a $API_APP_NAME
    heroku config:set REFRESH_TOKEN_EXPIRES_IN="7d" -a $API_APP_NAME
    heroku config:set CORS_ORIGIN="https://$WEB_APP_NAME.herokuapp.com" -a $API_APP_NAME
    
    # Web app environment variables
    print_status "Setting Web app environment variables..."
    heroku config:set NODE_ENV=production -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_API_URL="https://$API_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_WS_URL="wss://$API_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_APP_URL="https://$WEB_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    
    print_success "Environment variables set!"
}

# Function to deploy API
deploy_api() {
    print_status "Deploying API application..."
    
    # Add Heroku remote if it doesn't exist
    if ! git remote | grep -q "heroku-api"; then
        git remote add heroku-api https://git.heroku.com/$API_APP_NAME.git
    fi
    
    # Deploy to Heroku
    git push heroku-api $BRANCH:main
    
    # Wait for deployment to complete
    print_status "Waiting for API deployment to complete..."
    sleep 30
    
    # Run database migrations
    print_status "Running database migrations..."
    heroku run "cd apps/api && npx prisma migrate deploy" -a $API_APP_NAME
    
    print_success "API deployed successfully!"
}

# Function to deploy Web app
deploy_web() {
    print_status "Deploying Web application..."
    
    # Add Heroku remote if it doesn't exist
    if ! git remote | grep -q "heroku-web"; then
        git remote add heroku-web https://git.heroku.com/$WEB_APP_NAME.git
    fi
    
    # Deploy to Heroku
    git push heroku-web $BRANCH:main
    
    # Wait for deployment to complete
    print_status "Waiting for Web app deployment to complete..."
    sleep 30
    
    print_success "Web app deployed successfully!"
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check API health
    print_status "Checking API health..."
    API_URL="https://$API_APP_NAME.herokuapp.com"
    if curl -s "$API_URL/health" >/dev/null; then
        print_success "API is healthy!"
    else
        print_error "API health check failed!"
        return 1
    fi
    
    # Check Web app
    print_status "Checking Web app..."
    WEB_URL="https://$WEB_APP_NAME.herokuapp.com"
    if curl -s "$WEB_URL" >/dev/null; then
        print_success "Web app is accessible!"
    else
        print_error "Web app is not accessible!"
        return 1
    fi
    
    print_success "Deployment verification completed!"
}

# Function to display deployment information
display_deployment_info() {
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Web App: https://$WEB_APP_NAME.herokuapp.com"
    echo "   API: https://$API_APP_NAME.herokuapp.com"
    echo ""
    echo "📊 Monitoring:"
    echo "   API Logs: heroku logs --tail -a $API_APP_NAME"
    echo "   Web Logs: heroku logs --tail -a $WEB_APP_NAME"
    echo ""
    echo "🔧 Management:"
    echo "   API Status: heroku ps -a $API_APP_NAME"
    echo "   Web Status: heroku ps -a $WEB_APP_NAME"
    echo ""
    echo "🗄️ Database:"
    echo "   Connect: heroku pg:psql -a $API_APP_NAME"
    echo "   Info: heroku pg:info -a $API_APP_NAME"
    echo ""
}

# Main deployment function
main() {
    echo "🚀 VulHub Leaderboard Deployment Script"
    echo "======================================"
    echo ""
    
    # Check prerequisites
    check_prerequisites
    
    # Build application
    build_application
    
    # Create Heroku apps
    create_heroku_apps
    
    # Configure Heroku apps
    configure_heroku_apps
    
    # Set environment variables
    set_environment_variables
    
    # Deploy API
    deploy_api
    
    # Deploy Web app
    deploy_web
    
    # Verify deployment
    verify_deployment
    
    # Display information
    display_deployment_info
}

# Handle script arguments
case "${1:-}" in
    --help|-h)
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --api-only     Deploy only the API"
        echo "  --web-only     Deploy only the Web app"
        echo "  --verify-only  Only verify existing deployment"
        echo ""
        exit 0
        ;;
    --api-only)
        check_prerequisites
        build_application
        create_heroku_apps
        configure_heroku_apps
        set_environment_variables
        deploy_api
        verify_deployment
        ;;
    --web-only)
        check_prerequisites
        build_application
        create_heroku_apps
        configure_heroku_apps
        set_environment_variables
        deploy_web
        verify_deployment
        ;;
    --verify-only)
        verify_deployment
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
