@echo off
REM VulHub Build Script for Windows
REM This script builds all packages and prepares for containerization

setlocal enabledelayedexpansion

echo 🚀 Building VulHub Leaderboard...

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not installed. Please install pnpm first.
    exit /b 1
)

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Docker is not installed. Containerization will not be available.
)

REM Clean previous builds
echo [INFO] Cleaning previous builds...
call pnpm clean

REM Install dependencies
echo [INFO] Installing dependencies...
call pnpm install

REM Build packages in order
echo [INFO] Building packages...

REM Build shared packages first
echo [INFO] Building @vulhub/config...
cd packages\config
call pnpm build
cd ..\..

echo [INFO] Building @vulhub/schema...
cd packages\schema
call pnpm build
cd ..\..

echo [INFO] Building @vulhub/utils...
cd packages\utils
call pnpm build
cd ..\..

echo [INFO] Building @vulhub/ui...
cd packages\ui
call pnpm build
cd ..\..

REM Build applications
echo [INFO] Building @vulhub/api...
cd apps\api
call pnpm build
cd ..\..

echo [INFO] Building @vulhub/web...
cd apps\web
call pnpm build
cd ..\..

REM Run type checking
echo [INFO] Running type checks...
call pnpm type-check

REM Run linting
echo [INFO] Running linting...
call pnpm lint

echo [SUCCESS] All packages built successfully!

REM Check if Docker is available for containerization
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Docker is available. You can now run:
    echo   docker-compose up --build
    echo   or
    echo   docker build -t vulhub-web -f Dockerfile --target web-production .
    echo   docker build -t vulhub-api -f Dockerfile --target api-production .
) else (
    echo [WARNING] Docker is not available. Install Docker to enable containerization.
)

echo [SUCCESS] Build completed successfully! 🎉
