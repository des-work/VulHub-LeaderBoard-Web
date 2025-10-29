@echo off
REM Docker build script for VulHub Leaderboard (Windows)
REM This script builds Docker images for both API and Web applications

setlocal enabledelayedexpansion

echo 🐳 Building VulHub Leaderboard Docker Images...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

REM Build API image
echo [INFO] Building API image...
docker build --target api-production -t vulhub-api:latest .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build API image
    exit /b 1
)
echo [INFO] ✅ API image built successfully

REM Build Web image
echo [INFO] Building Web image...
docker build --target web-production -t vulhub-web:latest .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build Web image
    exit /b 1
)
echo [INFO] ✅ Web image built successfully

REM Build base image for development
echo [INFO] Building base image for development...
docker build --target base -t vulhub-base:latest .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build base image
    exit /b 1
)
echo [INFO] ✅ Base image built successfully

echo [INFO] 🎉 All Docker images built successfully!
echo [INFO] Available images:
docker images | findstr vulhub

echo.
echo [INFO] Next steps:
echo   Development: docker-compose -f docker-compose.dev.yml up
echo   Production:  docker-compose -f docker-compose.production.yml up
echo   Default:     docker-compose up
