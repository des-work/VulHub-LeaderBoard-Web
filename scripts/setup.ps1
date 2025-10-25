# VulHub Leaderboard Setup Script (Windows PowerShell)
# This script sets up the development environment for the VulHub Leaderboard project

param(
    [switch]$SkipInfrastructure,
    [switch]$SkipDatabase,
    [switch]$SkipTests
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Reset = "`e[0m"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "${Blue}[INFO]${Reset} $Message"
}

function Write-Success {
    param([string]$Message)
    Write-Host "${Green}[SUCCESS]${Reset} $Message"
}

function Write-Warning {
    param([string]$Message)
    Write-Host "${Yellow}[WARNING]${Reset} $Message"
}

function Write-Error {
    param([string]$Message)
    Write-Host "${Red}[ERROR]${Reset} $Message"
}

# Check if required tools are installed
function Test-Requirements {
    Write-Status "Checking requirements..."
    
    # Check Node.js
    try {
        $nodeVersion = node -v
        $versionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
        if ($versionNumber -lt 18) {
            Write-Error "Node.js version 18+ is required. Current version: $nodeVersion"
            exit 1
        }
        Write-Success "Node.js version: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    }
    
    # Check PNPM
    try {
        $pnpmVersion = pnpm -v
        Write-Success "PNPM version: $pnpmVersion"
    }
    catch {
        Write-Warning "PNPM is not installed. Installing PNPM..."
        npm install -g pnpm
    }
    
    # Check Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker version: $dockerVersion"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop from https://docker.com/"
        exit 1
    }
    
    # Check Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose version: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose is not installed. Please install Docker Desktop with Compose support"
        exit 1
    }
    
    Write-Success "All requirements satisfied!"
}

# Install dependencies
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    pnpm install
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencies installed!"
    } else {
        Write-Error "Failed to install dependencies"
        exit 1
    }
}

# Setup environment variables
function Set-Environment {
    Write-Status "Setting up environment variables..."
    
    if (-not (Test-Path ".env")) {
        Copy-Item "infra/env.example" ".env"
        Write-Success "Environment file created from template!"
        Write-Warning "Please review and update .env file with your configuration"
    } else {
        Write-Warning "Environment file already exists, skipping..."
    }
}

# Start infrastructure services
function Start-Infrastructure {
    if ($SkipInfrastructure) {
        Write-Warning "Skipping infrastructure setup"
        return
    }
    
    Write-Status "Starting infrastructure services..."
    
    # Start Docker services
    docker-compose -f infra/docker-compose.dev.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Infrastructure services started!"
        
        # Wait for services to be ready
        Write-Status "Waiting for services to be ready..."
        Start-Sleep -Seconds 10
        
        # Check if services are running
        $services = docker-compose -f infra/docker-compose.dev.yml ps
        if ($services -match "Up") {
            Write-Success "All services are running!"
        } else {
            Write-Warning "Some services may not be running properly"
        }
    } else {
        Write-Error "Failed to start infrastructure services"
        exit 1
    }
}

# Setup database
function Set-Database {
    if ($SkipDatabase) {
        Write-Warning "Skipping database setup"
        return
    }
    
    Write-Status "Setting up database..."
    
    # Generate Prisma client
    Set-Location prisma
    pnpm generate
    Set-Location ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Prisma client generated!"
    } else {
        Write-Error "Failed to generate Prisma client"
        exit 1
    }
    
    # Run migrations
    pnpm db:migrate
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations applied!"
    } else {
        Write-Error "Failed to run database migrations"
        exit 1
    }
    
    # Seed database
    pnpm db:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database seeded!"
    } else {
        Write-Error "Failed to seed database"
        exit 1
    }
}

# Build packages
function Build-Packages {
    Write-Status "Building packages..."
    pnpm build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Packages built successfully!"
    } else {
        Write-Error "Failed to build packages"
        exit 1
    }
}

# Run tests
function Test-Application {
    if ($SkipTests) {
        Write-Warning "Skipping tests"
        return
    }
    
    Write-Status "Running tests..."
    pnpm test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tests passed!"
    } else {
        Write-Warning "Some tests failed, but continuing..."
    }
}

# Main setup function
function Main {
    Write-Host "🏰 VulHub Leaderboard Setup" -ForegroundColor Cyan
    Write-Host "==========================" -ForegroundColor Cyan
    Write-Host ""
    
    Test-Requirements
    Install-Dependencies
    Set-Environment
    Start-Infrastructure
    Set-Database
    Build-Packages
    Test-Application
    
    Write-Host ""
    Write-Host "🎉 Setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Review and update .env file if needed"
    Write-Host "2. Run 'pnpm dev' to start development servers"
    Write-Host "3. Visit http://localhost:3000 for the web app"
    Write-Host "4. Visit http://localhost:4000/api/health for the API"
    Write-Host "5. Visit http://localhost:5555 for Prisma Studio"
    Write-Host "6. Visit http://localhost:8025 for MailHog"
    Write-Host ""
    Write-Host "Happy coding! 🚀" -ForegroundColor Green
}

# Run main function
Main
