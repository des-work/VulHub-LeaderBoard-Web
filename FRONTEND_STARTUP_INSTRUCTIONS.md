# Frontend Startup Instructions

## Issue
Frontend not starting because `.env.local` file is gitignored and background process didn't create it.

## Solution

### Step 1: Create `.env.local` File

**Location:** `apps/web/.env.local`

**Create manually:** Open PowerShell and run:

```powershell
@"
# Frontend Environment Variables for Local Development
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_WS_URL=ws://localhost:4010
NODE_ENV=development
"@ | Out-File -FilePath "apps\web\.env.local" -Encoding UTF8
```

**OR** create it manually:
1. Navigate to `apps/web/` folder
2. Create new file: `.env.local`
3. Copy/paste this content:

```
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_WS_URL=ws://localhost:4010
NODE_ENV=development
```

### Step 2: Start Frontend

**Open a NEW PowerShell window** and run:

```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\web"
pnpm dev -- -p 3010
```

**Wait for this message:**
```
✓ Ready in XXXms
○ Local: http://localhost:3010
```

### Step 3: Test

1. Open browser: http://localhost:3010
2. Should see login page
3. Login: `admin@vulhub.com` / `admin123`

---

## Alternative: Use the Script (After Creating .env.local)

Once `.env.local` exists, you can use:

```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-web.ps1
```

The script will detect the existing file and start the server.

---

## Troubleshooting

### Port 3010 Still Refused

1. Check if process is running: `netstat -ano | findstr :3010`
2. If not, start manually from `apps/web` folder
3. Check for errors in PowerShell window

### Module Not Found Errors

Run from project root:
```powershell
pnpm install
```

### Environment Variables Not Working

1. Make sure `.env.local` is in `apps/web/` folder (not project root)
2. Restart Next.js after creating file
3. Check file has no BOM or special characters

