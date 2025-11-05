# 🚀 VERCEL DEPLOYMENT & DATABASE SIMPLIFICATION PLAN

## Executive Summary
Transform your PostgreSQL-based architecture to a **file-based SQLite solution** optimized for Vercel edge functions and serverless deployment with zero external database dependencies.

---

## 📊 CURRENT vs SIMPLIFIED ARCHITECTURE

### Current (Complex)
- PostgreSQL database (external)
- Prisma ORM with complex migrations
- Redis caching layer
- Monorepo with worker apps
- CQRS/Event Sourcing patterns
- Multi-adapter storage (MINIO, etc.)

### Simplified (File-Based)
- **SQLite database** (local file, included in deployment)
- **Simple JSON file storage** for images/documents
- **In-memory caching** (no Redis)
- **Vercel serverless functions** (Next.js API routes)
- **Flat service layer** (no CQRS/events)
- **Built-in file storage** with `/public` directory

---

## 🎯 PHASE 1: DATABASE MIGRATION (SQLite)

### 1.1 Switch Database Provider
**File**: `apps/api/prisma/schema.prisma`

**Changes**:
```prisma
datasource db {
  provider = "sqlite"  // Changed from "postgresql"
  url      = env("DATABASE_URL")
}
```

**Environment**:
```env
# apps/api/.env.local
DATABASE_URL="file:./prisma/dev.db"
```

**Benefits**:
- ✅ No external database required
- ✅ Zero connection management
- ✅ Automatic migrations
- ✅ File-based persistence
- ✅ Works in Vercel serverless

---

## 📁 PHASE 2: FILE STORAGE SYSTEM (JSON + /public)

### 2.1 File Storage Architecture
```
apps/web/public/
├── uploads/
│   ├── submissions/
│   │   ├── evidence/
│   │       ├── image1.jpg
│   │       └── image2.png
│   └── avatars/
│       └── user-id.jpg
```

### 2.2 File Storage Service
**New File**: `apps/api/src/adapters/storage/file-storage.service.ts`

```typescript
@Injectable()
export class FileStorageService {
  // Store metadata in database
  // Store actual files in /public/uploads
  
  async uploadSubmissionEvidence(
    userId: string,
    projectId: string,
    files: Express.Multer.File[]
  ): Promise<string[]> {
    // Returns: ['/uploads/submissions/evidence/file1.jpg', ...]
  }
}
```

---

## 🗄️ PHASE 3: SIMPLIFIED DATABASE SCHEMA

### 3.1 Keep Essential Tables
- `users` - User accounts
- `projects` - Challenge projects
- `submissions` - User submissions
- `badges` - Badge definitions
- `user_badges` - User badge progress
- `leaderboards` - Cached rankings

### 3.2 Optimized Schema
```prisma
model Submission {
  id              String   @id @default(cuid())
  projectId       String
  userId          String
  status          SubmissionStatus @default(PENDING)
  score           Int?
  feedback        String?
  evidencePaths   String[]  // Array of /uploads/submissions/evidence/*.jpg
  submittedAt     DateTime  @default(now())
  reviewedAt      DateTime?
  reviewedBy      String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("submissions")
}
```

---

## 🔧 PHASE 4: API CHANGES

### 4.1 Remove Redis Dependencies
**Files to delete**:
- `apps/api/src/adapters/redis/` (entire directory)

**Changes**:
- Replace with in-memory cache
- No token blacklist persistence needed for MVP

### 4.2 Update Controllers for File Upload
```typescript
@Controller('submissions')
export class SubmissionsController {
  @Post()
  @UseInterceptors(FileInterceptor('evidence'))
  async create(
    @Body() dto: CreateSubmissionDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.submissionsService.create(dto, file);
  }
}
```

---

## 🌐 PHASE 5: VERCEL DEPLOYMENT SETUP

### 5.1 Vercel Configuration
**File**: `vercel.json`
```json
{
  "buildCommand": "pnpm install && pnpm build",
  "outputDirectory": "apps/web/.next",
  "env": {
    "DATABASE_URL": "@database_url",
    "NODE_ENV": "production"
  }
}
```

### 5.2 Environment Variables (In Vercel Dashboard)
```env
DATABASE_URL=file:/tmp/prisma/prod.db
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
API_URL=https://your-site.vercel.app
NEXT_PUBLIC_API_URL=https://your-site.vercel.app
```

### 5.3 Deployment Command
```bash
vercel deploy --prod
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Database (1 hour)
- [ ] Update `prisma/schema.prisma` to SQLite
- [ ] Update `.env` files
- [ ] Test local SQLite connection
- [ ] Run migrations

### Phase 2: File Storage (2 hours)
- [ ] Create `FileStorageService`
- [ ] Set up `/public/uploads/` structure
- [ ] Update `Submission` model
- [ ] Add multer middleware
- [ ] Test file uploads

### Phase 3: API Updates (1 hour)
- [ ] Remove Redis
- [ ] Add in-memory cache
- [ ] Update service files
- [ ] Update controllers

### Phase 4: Vercel Setup (30 minutes)
- [ ] Create Vercel project
- [ ] Set environment variables
- [ ] Configure build settings
- [ ] Deploy to preview
- [ ] Deploy to production

---

## 💰 COST SAVINGS

| Item | Before | After |
|------|--------|-------|
| Database | $10-50/mo | FREE |
| Hosting | $5-25/mo | FREE |
| **Monthly Total** | **$15-75** | **$0** |

---

## ✨ SUCCESS CRITERIA

✅ Website deploys to Vercel with one click
✅ No external database required
✅ SQLite database included with deployment
✅ File uploads stored in `/public`
✅ Zero configuration needed
✅ $0/month hosting cost

---

**Ready to begin? Start Phase 1!** 🚀
