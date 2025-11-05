# Vercel Environment Variables

## Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### Frontend (Next.js Web App)

```env
# API URL (for frontend to call backend)
NEXT_PUBLIC_API_URL=https://your-api-domain.com

# Node Environment
NODE_ENV=production
```

### Backend (NestJS API) - Deploy separately or use Next.js API routes

**Option 1: SQLite (Development/Testing)**
```env
# Database (SQLite - use /tmp for Vercel serverless)
DATABASE_URL=file:/tmp/vulhub.db

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# App Configuration
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Email (optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vulhub.com
```

**Option 2: Vercel Postgres (Recommended for Production)**
```env
# Database (Vercel Postgres - recommended)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# App Configuration
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vulhub.com
```

---

## Environment Variable Setup Steps

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables

2. **Add each variable**:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your API URL
   - Environment: Production, Preview, Development (select all)

3. **For Production**:
   - Use strong, random secrets for JWT
   - Generate secrets: `openssl rand -hex 32`
   - Set `NODE_ENV=production`
   - Use production database URL

4. **For Preview/Development**:
   - Can use development values
   - Use local/test database

---

## Security Notes

⚠️ **Never commit secrets to git!**

✅ **Use Vercel Environment Variables** for all secrets
✅ **Generate strong secrets** (32+ characters)
✅ **Rotate secrets** periodically
✅ **Use different secrets** for production vs development

---

## Database Options

### Option 1: SQLite (Simple, File-Based)
- ✅ No external service
- ✅ Works with `/tmp` on Vercel
- ⚠️ Ephemeral (lost on restart)
- ⚠️ Not shared across instances
- 📝 Best for: Development, testing, small apps

### Option 2: Vercel Postgres (Recommended)
- ✅ Persistent storage
- ✅ Shared across instances
- ✅ Managed service
- ✅ Built-in backups
- 📝 Best for: Production apps

### Option 3: External Database
- ✅ Full control
- ✅ Any provider (Railway, Supabase, etc.)
- ⚠️ Requires separate setup
- 📝 Best for: Complex requirements

---

## Quick Setup Commands

### Generate JWT Secrets
```bash
# Linux/macOS
openssl rand -hex 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### Test Environment Variables
```bash
# Check if variables are set
echo $NEXT_PUBLIC_API_URL
echo $DATABASE_URL
```

