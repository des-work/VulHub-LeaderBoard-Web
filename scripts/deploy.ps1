# VulHub Leaderboard - PowerShell Deployment Script
# This script automates the deployment process to Heroku on Windows

param(
    [switch]$ApiOnly,
    [switch]$WebOnly,
    [switch]$VerifyOnly,
    [switch]$Help
)

# Configuration
$API_APP_NAME = "vulhub-leaderboard-api"
$WEB_APP_NAME = "vulhub-leaderboard-web"
$BRANCH = "main"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check prerequisites
function Test-Prerequisites {
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "heroku")) {
        Write-Error "Heroku CLI is not installed. Please install it first."
        exit 1
    }
    
    if (-not (Test-Command "pnpm")) {
        Write-Error "pnpm is not installed. Please install it first."
        exit 1
    }
    
    if (-not (Test-Command "git")) {
        Write-Error "Git is not installed. Please install it first."
        exit 1
    }
    
    # Check if logged in to Heroku
    try {
        heroku auth:whoami | Out-Null
    }
    catch {
        Write-Error "Not logged in to Heroku. Please run 'heroku login' first."
        exit 1
    }
    
    Write-Success "All prerequisites met!"
}

# Function to build the application
function Build-Application {
    Write-Status "Building application..."
    
    # Install dependencies
    Write-Status "Installing dependencies..."
    pnpm install
    
    # Build all packages
    Write-Status "Building all packages..."
    pnpm build
    
    # Type check
    Write-Status "Running type checks..."
    pnpm type-check
    
    Write-Success "Application built successfully!"
}

# Function to create Heroku apps if they don't exist
function New-HerokuApps {
    Write-Status "Checking Heroku applications..."
    
    # Check if API app exists
    try {
        heroku apps:info $API_APP_NAME | Out-Null
        Write-Success "API application already exists: $API_APP_NAME"
    }
    catch {
        Write-Status "Creating API application: $API_APP_NAME"
        heroku create $API_APP_NAME
    }
    
    # Check if Web app exists
    try {
        heroku apps:info $WEB_APP_NAME | Out-Null
        Write-Success "Web application already exists: $WEB_APP_NAME"
    }
    catch {
        Write-Status "Creating Web application: $WEB_APP_NAME"
        heroku create $WEB_APP_NAME
    }
}

# Function to configure Heroku apps
function Set-HerokuConfiguration {
    Write-Status "Configuring Heroku applications..."
    
    # Configure API app
    Write-Status "Configuring API application..."
    heroku buildpacks:set heroku/nodejs -a $API_APP_NAME
    
    # Add PostgreSQL add-on
    try {
        heroku addons:info heroku-postgresql -a $API_APP_NAME | Out-Null
        Write-Success "PostgreSQL add-on already exists"
    }
    catch {
        Write-Status "Adding PostgreSQL add-on..."
        heroku addons:create heroku-postgresql:mini -a $API_APP_NAME
    }
    
    # Add Redis add-on
    try {
        heroku addons:info heroku-redis -a $API_APP_NAME | Out-Null
        Write-Success "Redis add-on already exists"
    }
    catch {
        Write-Status "Adding Redis add-on..."
        heroku addons:create heroku-redis:mini -a $API_APP_NAME
    }
    
    # Configure Web app
    Write-Status "Configuring Web application..."
    heroku buildpacks:set heroku/nodejs -a $WEB_APP_NAME
}

# Function to set environment variables
function Set-EnvironmentVariables {
    Write-Status "Setting environment variables..."
    
    # Generate random secrets
    $JWT_SECRET = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    $REFRESH_SECRET = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
    
    # API environment variables
    Write-Status "Setting API environment variables..."
    heroku config:set NODE_ENV=production -a $API_APP_NAME
    heroku config:set API_PORT=3001 -a $API_APP_NAME
    heroku config:set JWT_SECRET=$JWT_SECRET -a $API_APP_NAME
    heroku config:set JWT_EXPIRES_IN="1h" -a $API_APP_NAME
    heroku config:set REFRESH_TOKEN_SECRET=$REFRESH_SECRET -a $API_APP_NAME
    heroku config:set REFRESH_TOKEN_EXPIRES_IN="7d" -a $API_APP_NAME
    heroku config:set CORS_ORIGIN="https://$WEB_APP_NAME.herokuapp.com" -a $API_APP_NAME
    
    # Web app environment variables
    Write-Status "Setting Web app environment variables..."
    heroku config:set NODE_ENV=production -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_API_URL="https://$API_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_WS_URL="wss://$API_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    heroku config:set NEXT_PUBLIC_APP_URL="https://$WEB_APP_NAME.herokuapp.com" -a $WEB_APP_NAME
    
    Write-Success "Environment variables set!"
}

# Function to deploy API
function Deploy-Api {
    Write-Status "Deploying API application..."
    
    # Add Heroku remote if it doesn't exist
    $remotes = git remote
    if ($remotes -notcontains "heroku-api") {
        git remote add heroku-api https://git.heroku.com/$API_APP_NAME.git
    }
    
    # Deploy to Heroku
    git push heroku-api $BRANCH:main
    
    # Wait for deployment to complete
    Write-Status "Waiting for API deployment to complete..."
    Start-Sleep -Seconds 30
    
    # Run database migrations
    Write-Status "Running database migrations..."
    heroku run "cd apps/api && npx prisma migrate deploy" -a $API_APP_NAME
    
    Write-Success "API deployed successfully!"
}

# Function to deploy Web app
function Deploy-Web {
    Write-Status "Deploying Web application..."
    
    # Add Heroku remote if it doesn't exist
    $remotes = git remote
    if ($remotes -notcontains "heroku-web") {
        git remote add heroku-web https://git.heroku.com/$WEB_APP_NAME.git
    }
    
    # Deploy to Heroku
    git push heroku-web $BRANCH:main
    
    # Wait for deployment to complete
    Write-Status "Waiting for Web app deployment to complete..."
    Start-Sleep -Seconds 30
    
    Write-Success "Web app deployed successfully!"
}

# Function to verify deployment
function Test-Deployment {
    Write-Status "Verifying deployment..."
    
    # Check API health
    Write-Status "Checking API health..."
    $API_URL = "https://$API_APP_NAME.herokuapp.com"
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "API is healthy!"
        } else {
            Write-Error "API health check failed!"
            return $false
        }
    }
    catch {
        Write-Error "API health check failed!"
        return $false
    }
    
    # Check Web app
    Write-Status "Checking Web app..."
    $WEB_URL = "https://$WEB_APP_NAME.herokuapp.com"
    try {
        $response = Invoke-WebRequest -Uri $WEB_URL -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Web app is accessible!"
        } else {
            Write-Error "Web app is not accessible!"
            return $false
        }
    }
    catch {
        Write-Error "Web app is not accessible!"
        return $false
    }
    
    Write-Success "Deployment verification completed!"
    return $true
}

# Function to display deployment information
function Show-DeploymentInfo {
    Write-Success "Deployment completed successfully!"
    Write-Host ""
    Write-Host "🌐 Application URLs:" -ForegroundColor Cyan
    Write-Host "   Web App: https://$WEB_APP_NAME.herokuapp.com" -ForegroundColor White
    Write-Host "   API: https://$API_APP_NAME.herokuapp.com" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Monitoring:" -ForegroundColor Cyan
    Write-Host "   API Logs: heroku logs --tail -a $API_APP_NAME" -ForegroundColor White
    Write-Host "   Web Logs: heroku logs --tail -a $WEB_APP_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Management:" -ForegroundColor Cyan
    Write-Host "   API Status: heroku ps -a $API_APP_NAME" -ForegroundColor White
    Write-Host "   Web Status: heroku ps -a $WEB_APP_NAME" -ForegroundColor White
    Write-Host ""
    Write-Host "🗄️ Database:" -ForegroundColor Cyan
    Write-Host "   Connect: heroku pg:psql -a $API_APP_NAME" -ForegroundColor White
    Write-Host "   Info: heroku pg:info -a $API_APP_NAME" -ForegroundColor White
    Write-Host ""
}

# Main deployment function
function Start-Deployment {
    Write-Host "🚀 VulHub Leaderboard Deployment Script" -ForegroundColor Magenta
    Write-Host "======================================" -ForegroundColor Magenta
    Write-Host ""
    
    # Check prerequisites
    Test-Prerequisites
    
    # Build application
    Build-Application
    
    # Create Heroku apps
    New-HerokuApps
    
    # Configure Heroku apps
    Set-HerokuConfiguration
    
    # Set environment variables
    Set-EnvironmentVariables
    
    # Deploy API
    Deploy-Api
    
    # Deploy Web app
    Deploy-Web
    
    # Verify deployment
    Test-Deployment
    
    # Display information
    Show-DeploymentInfo
}

# Handle script arguments
if ($Help) {
    Write-Host "Usage: .\deploy.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -ApiOnly      Deploy only the API"
    Write-Host "  -WebOnly      Deploy only the Web app"
    Write-Host "  -VerifyOnly   Only verify existing deployment"
    Write-Host "  -Help         Show this help message"
    Write-Host ""
    exit 0
}

if ($ApiOnly) {
    Test-Prerequisites
    Build-Application
    New-HerokuApps
    Set-HerokuConfiguration
    Set-EnvironmentVariables
    Deploy-Api
    Test-Deployment
}
elseif ($WebOnly) {
    Test-Prerequisites
    Build-Application
    New-HerokuApps
    Set-HerokuConfiguration
    Set-EnvironmentVariables
    Deploy-Web
    Test-Deployment
}
elseif ($VerifyOnly) {
    Test-Deployment
}
else {
    Start-Deployment
}
