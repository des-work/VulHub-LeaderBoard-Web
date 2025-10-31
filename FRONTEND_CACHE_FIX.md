# Frontend Cache Error Fix

## Issue
Next.js webpack cache corrupted. Error: `ENOENT: no such file or directory, stat '.next/cache/webpack/...'`

## Solution

### Step 1: Stop the Server
In your PowerShell window where frontend is running:
- Press `Ctrl + C`

### Step 2: Clear All Caches
Run these commands:

```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\web"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### Step 3: Restart Frontend
```powershell
pnpm dev -- -p 3010
```

This will rebuild the cache from scratch. First compilation will take 30-60 seconds.

---

## Quick One-Liner

Stop the server (Ctrl+C), then run:
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\web"; Remove-Item -Recurse -Force .next, node_modules\.cache -ErrorAction SilentlyContinue; pnpm dev -- -p 3010
```

---

## What This Does
- Removes corrupted webpack cache
- Removes Next.js build artifacts
- Forces fresh compilation
- Rebuilds everything from source

---

## Expected Output After Restart
```
✓ Starting...
✓ Ready in 30-60s
○ Compiling /
✓ Compiled / in XXXms
```

Then http://localhost:3010 should work.

