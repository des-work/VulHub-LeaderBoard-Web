# 🏗️ System Architecture Overview

**Understanding the VulHub Leaderboard architecture**

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Web Browser (Next.js 14)                   │  │
│  │  • React 18 Components                                │  │
│  │  • Tailwind CSS Styling                               │  │
│  │  • React Query (Data Fetching)                        │  │
│  │  • Client-side Routing                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           NestJS API Server                          │  │
│  │  • REST Endpoints                                     │  │
│  │  • JWT Authentication                                 │  │
│  │  • WebSocket Gateway                                  │  │
│  │  • Rate Limiting & Security                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ Prisma ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                         │  │
│  │  • User Data                                          │  │
│  │  • Challenges & Submissions                           │  │
│  │  • Leaderboards & Badges                              │  │
│  │  • Relationships & Constraints                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧱 Component Architecture

### Frontend (Next.js 14)

**Technology Stack:**
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Query + React Context
- **Type Safety:** TypeScript
- **Icons:** Lucide React

**Directory Structure:**
```
apps/web/src/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/Dashboard
│   ├── login/             # Authentication
│   ├── community/         # Forum
│   ├── challenges/        # Challenge list
│   ├── submissions/       # User submissions
│   ├── badges/            # Badge gallery
│   ├── profile/           # User profile
│   └── grading/           # Instructor console
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── features/         # Feature-specific
├── lib/                  # Utilities
│   ├── api/             # API client
│   ├── auth/            # Auth logic
│   └── hooks/           # Custom hooks
└── styles/              # Global styles
```

**Key Patterns:**
- **Server Components** - Default, better performance
- **Client Components** - Interactive UI (use `'use client'`)
- **API Routes** - Handled by NestJS backend
- **React Query** - Server state management
- **Context API** - Client state (auth, theme)

### Backend (NestJS)

**Technology Stack:**
- **Framework:** NestJS
- **ORM:** Prisma
- **Database:** PostgreSQL (SQLite for local dev)
- **Authentication:** JWT + Passport
- **Validation:** class-validator
- **Documentation:** Swagger/OpenAPI

**Directory Structure:**
```
apps/api/src/
├── modules/               # Feature modules
│   ├── auth/             # Authentication
│   ├── users/            # User management
│   ├── projects/         # Challenges
│   ├── submissions/      # Submissions & grading
│   ├── leaderboards/     # Rankings
│   └── badges/           # Badge system
├── common/               # Shared utilities
│   ├── guards/           # Auth, rate limiting
│   ├── interceptors/     # Logging, transform
│   ├── filters/          # Error handling
│   └── pipes/            # Validation
├── config/               # Configuration
├── adapters/             # External services
│   └── database/         # Prisma service
├── ws/                   # WebSocket gateway
└── main.ts               # App entry point
```

**Key Patterns:**
- **Modular Architecture** - Feature-based modules
- **Dependency Injection** - NestJS IoC container
- **Guards** - Authentication & authorization
- **Interceptors** - Request/response transformation
- **Pipes** - Input validation
- **DTOs** - Data transfer objects

### Database (PostgreSQL + Prisma)

**Schema Overview:**
```
┌─────────┐      ┌──────────────┐      ┌──────────────┐
│  User   │──────│  Submission  │──────│   Project    │
└─────────┘      └──────────────┘      └──────────────┘
     │                                         │
     │                                         │
     ▼                                         ▼
┌─────────────┐                      ┌──────────────┐
│  UserBadge  │──────────────────────│    Badge     │
└─────────────┘                      └──────────────┘
     │
     │
     ▼
┌──────────────┐
│  Leaderboard │
└──────────────┘
```

**Core Models:**
- `User` - Authentication & profile
- `Project` - Challenges/vulnerabilities
- `Submission` - User solutions
- `Badge` - Achievement definitions
- `UserBadge` - Earned badges
- `Leaderboard` - Cached rankings

**More details:** [Database Schema](database.md)

---

## 🔄 Request Flow

### 1. Authentication Flow

```
User (Browser)
  │
  │ 1. POST /auth/login { email, password }
  ▼
Frontend (Next.js)
  │
  │ 2. API Request
  ▼
Backend (NestJS)
  │
  ├─ 3. Validate credentials
  ├─ 4. Generate JWT tokens
  └─ 5. Return { user, accessToken, refreshToken }
  │
  ▼
Frontend
  │
  ├─ 6. Store tokens (localStorage)
  ├─ 7. Update auth context
  └─ 8. Redirect to dashboard
  │
  ▼
User sees Dashboard
```

### 2. Data Fetching Flow

```
User clicks "View Challenges"
  │
  ▼
React Component
  │
  │ useQuery('challenges', fetchChallenges)
  ▼
React Query
  │
  ├─ Check cache (return if fresh)
  └─ Fetch from API if stale
  │
  ▼
API Client
  │
  │ GET /projects
  │ Headers: { Authorization: Bearer <token> }
  ▼
Backend API
  │
  ├─ JWT Guard validates token
  ├─ Query database via Prisma
  └─ Transform & return data
  │
  ▼
React Query
  │
  ├─ Cache response
  └─ Update component
  │
  ▼
User sees Challenges
```

### 3. Submission Flow

```
User submits solution
  │
  ▼
Form Component
  │
  │ useMutation(submitSolution)
  ▼
API Client
  │
  │ POST /submissions
  │ Body: { projectId, files, description }
  ▼
Backend API
  │
  ├─ Validate input (DTO)
  ├─ Store files
  ├─ Create submission record
  ├─ Emit WebSocket event
  └─ Return submission
  │
  ▼
React Query
  │
  ├─ Invalidate submissions cache
  └─ Refetch fresh data
  │
  ▼
User sees confirmation
```

---

## 🔐 Security Architecture

### Authentication & Authorization

```
┌────────────────────────────────────────────────────┐
│                  CLIENT REQUEST                     │
└────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────┐
│              1. JWT Auth Guard                      │
│  • Extracts Bearer token from header                │
│  • Validates token signature                        │
│  • Checks expiration                                │
│  • Verifies token not blacklisted                   │
└────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────┐
│              2. Rate Limit Guard                    │
│  • Check request count per IP/user                  │
│  • Apply endpoint-specific limits                   │
│  • Return 429 if exceeded                           │
└────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────┐
│              3. Input Validation                    │
│  • Validate DTOs with class-validator               │
│  • Sanitize inputs                                  │
│  • Check required fields                            │
└────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────┐
│              4. Business Logic                      │
│  • Execute requested operation                      │
│  • Access database via Prisma (SQL injection safe)  │
└────────────────────────────────────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────────────────┐
│              5. Response Transform                  │
│  • Transform data to DTOs                           │
│  • Remove sensitive fields                          │
│  • Add success wrapper                              │
└────────────────────────────────────────────────────┘
```

**Security Layers:**
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt, 12 rounds)
- ✅ Rate Limiting (100 req/min general, 5 req/15min auth)
- ✅ CORS Configuration
- ✅ Helmet.js Security Headers
- ✅ Input Validation & Sanitization
- ✅ SQL Injection Protection (Prisma ORM)
- ✅ XSS Protection (CSP headers)

---

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────────┐
│                      USERS                           │
└─────────────────────────────────────────────────────┘
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────────────┐
│              CDN / Edge Network                      │
│  (Vercel Edge Network - Global)                     │
└─────────────────────────────────────────────────────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
┌───────────────────┐  ┌──────────────────┐
│  Frontend         │  │  Backend API     │
│  (Vercel)         │  │  (Railway/Heroku)│
│  • Next.js SSR    │  │  • NestJS        │
│  • Static Assets  │  │  • WebSockets    │
└───────────────────┘  └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  PostgreSQL DB   │
                    │  (Supabase)      │
                    │  • Connection    │
                    │    Pooling       │
                    └──────────────────┘
```

**Component Hosting:**
- **Frontend:** Vercel (auto-scaling, global CDN)
- **Backend:** Railway/Render/Heroku (container-based)
- **Database:** Supabase/managed PostgreSQL
- **File Storage:** Cloudinary/S3 (optional)
- **Monitoring:** Sentry (errors), LogRocket (session replay)

---

## 📊 Data Flow

### Leaderboard Update Flow

```
Student submits solution
  │
  ▼
Submission created in DB
  │
  ▼
Instructor grades submission
  │
  ▼
Submission status updated
  │
  ├─ Points awarded to user
  ├─ User.totalPoints updated
  ├─ Leaderboard cache invalidated
  └─ WebSocket event emitted
  │
  ▼
All connected clients receive update
  │
  ▼
Leaderboard auto-refreshes
```

### Badge Unlock Flow

```
User earns points / completes challenge
  │
  ▼
Badge service checks criteria
  │
  ├─ Check points threshold
  ├─ Check challenge completion
  ├─ Check category mastery
  └─ Check streaks
  │
  ▼
If criteria met:
  │
  ├─ Create UserBadge record
  ├─ WebSocket notification sent
  └─ UI shows unlock animation
```

---

## 🔧 Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 | React meta-framework, SSR |
| | React 18 | UI library |
| | Tailwind CSS | Utility-first CSS |
| | React Query | Server state management |
| | TypeScript | Type safety |
| **Backend** | NestJS | Node.js framework |
| | Prisma | ORM & database toolkit |
| | Passport | Authentication |
| | JWT | Token-based auth |
| | class-validator | Input validation |
| **Database** | PostgreSQL | Relational database |
| | Prisma Schema | Type-safe schema |
| **DevOps** | Vercel | Frontend hosting |
| | Railway | Backend hosting |
| | Supabase | Database hosting |
| | GitHub Actions | CI/CD (future) |

---

## 📚 Related Documentation

- [Frontend Architecture](frontend.md) - Next.js details
- [Backend Architecture](backend.md) - NestJS details
- [Database Schema](database.md) - Data models
- [Architecture Decisions](decisions/) - ADRs

---

<sub>Last Updated: February 10, 2026 | [Edit this page](overview.md) | [Back to Docs](../README.md)</sub>

