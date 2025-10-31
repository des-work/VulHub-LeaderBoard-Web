# Quick Integration Test Script
# Tests API and Frontend connectivity

Write-Host "Testing VulHub Integration..." -ForegroundColor Cyan
Write-Host ""

# Test 1: API Health Check
Write-Host "Test 1: API Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4010/api/v1/health" -Method Get -ErrorAction Stop
    if ($health.success) {
        Write-Host "  PASS: API is healthy" -ForegroundColor Green
        Write-Host "  Status: $($health.data.status)" -ForegroundColor Gray
    } else {
        Write-Host "  FAIL: API returned unhealthy status" -ForegroundColor Red
    }
} catch {
    Write-Host "  FAIL: Cannot reach API on port 4010" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 2: API Login
Write-Host "Test 2: API Login (admin@vulhub.com)" -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@vulhub.com"
        password = "admin123"
    } | ConvertTo-Json

    $login = Invoke-RestMethod -Uri "http://localhost:4010/api/v1/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop

    if ($login.success -and $login.data.accessToken) {
        Write-Host "  PASS: Login successful" -ForegroundColor Green
        Write-Host "  User: $($login.data.user.email)" -ForegroundColor Gray
        Write-Host "  Role: $($login.data.user.role)" -ForegroundColor Gray
        $global:accessToken = $login.data.accessToken
    } else {
        Write-Host "  FAIL: Login response invalid" -ForegroundColor Red
    }
} catch {
    Write-Host "  FAIL: Login request failed" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""

# Test 3: Frontend Access
Write-Host "Test 3: Frontend Access" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:3010" -Method Get -ErrorAction Stop -TimeoutSec 5
    if ($frontend.StatusCode -eq 200) {
        Write-Host "  PASS: Frontend is responding" -ForegroundColor Green
        Write-Host "  Status Code: $($frontend.StatusCode)" -ForegroundColor Gray
    } else {
        Write-Host "  FAIL: Frontend returned status $($frontend.StatusCode)" -ForegroundColor Red
    }
} catch {
    Write-Host "  FAIL: Cannot reach frontend on port 3010" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    Write-Host "  Hint: Frontend may still be starting up (takes ~30 seconds)" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: Protected Endpoint (if we have a token)
if ($global:accessToken) {
    Write-Host "Test 4: Protected Endpoint Access" -ForegroundColor Yellow
    try {
        $headers = @{
            Authorization = "Bearer $($global:accessToken)"
        }
        $profile = Invoke-RestMethod -Uri "http://localhost:4010/api/v1/users/profile" `
            -Method Get `
            -Headers $headers `
            -ErrorAction Stop

        if ($profile.success) {
            Write-Host "  PASS: Protected endpoint accessible" -ForegroundColor Green
            Write-Host "  Profile: $($profile.data.email)" -ForegroundColor Gray
        } else {
            Write-Host "  FAIL: Protected endpoint returned error" -ForegroundColor Red
        }
    } catch {
        Write-Host "  FAIL: Cannot access protected endpoint" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Health:     Check output above" -ForegroundColor White
Write-Host "API Login:      Check output above" -ForegroundColor White
Write-Host "Frontend:       Check output above" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. If frontend failed, wait 30 seconds and run this script again" -ForegroundColor White
Write-Host "2. Open browser: http://localhost:3010" -ForegroundColor White
Write-Host "3. Login with: admin@vulhub.com / admin123" -ForegroundColor White
Write-Host ""

