# VulHub Leaderboard Web Application

[![Status: Beta](https://img.shields.io/badge/Status-Beta-yellow)](./README.md)
[![Tech Stack: Next.js + NestJS + PostgreSQL](https://img.shields.io/badge/Tech%20Stack-Next.js%20%2B%20NestJS%20%2B%20PostgreSQL-blue)](./README.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

> **A gamified cybersecurity learning platform** where students compete, collaborate, and master real-world vulnerability challenges through an immersive, rewarding experience.

---

## 📖 Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing the Application](#testing-the-application)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Support & Troubleshooting](#support--troubleshooting)

---

## Project Overview

### Vision

VulHub Leaderboard transforms cybersecurity education into an engaging, competitive experience. Students tackle real vulnerabilities, earn badges, build streaks, and compete for positions on a live leaderboard—all while developing practical security skills.

### Why This Matters

- **Gamification Drives Engagement**: Leaderboards, streaks, and achievements motivate consistent participation
- **Community Learning**: Students discuss vulnerabilities, share solutions, and learn from each other
- **Real-World Skills**: Challenges pull from actual cybersecurity vulnerabilities and attack vectors
- **Progressive Difficulty**: Badge system rewards mastery across multiple difficulty levels
- **Instructor Insight**: Grading console provides detailed feedback and progress tracking

### Current Status

**Phase**: Production Ready (85% - See [PRODUCTION_READINESS_ASSESSMENT.md](./PRODUCTION_READINESS_ASSESSMENT.md))  
**Test Environment**: Fully functional local development setup  
**Database**: PostgreSQL/SQLite with seed data included  
**Deployment**: Ready for Vercel + Render/Railway + Supabase (100% free options available)

---

## Core Features

### 🏆 Live Leaderboard System

The **Live Leaderboard** is the centerpiece of VulHub—a real-time, animated ranking system that showcases top performers.

**Key Capabilities:**
- **Top 15 Rankings**: Displays the highest-performing students with detailed score breakdown
- **Dynamic Status Indicators**:
  - 🔥 **On-Fire**: Active participants with current streak
  - 📈 **Streak Counter**: Consecutive days/submissions
  - 🎯 **Close-Match Indicator**: Nearby competitors for motivation
- **Animated Progress Bars**: Visual representation of point accumulation
- **Rank Icons**: Crown for #1, medals for top 3, trophies for top 15
- **Real-Time Updates**: Leaderboard reflects submissions and grading instantly

**User Experience:**
- Welcome card with personalized greeting
- Quick stats showing your rank, points, and badge count
- One-click navigation to start competing or join community
- Responsive design works on desktop and mobile devices

```typescript
// The leaderboard auto-refreshes when data changes
GET /api/v1/leaderboards
GET /api/v1/leaderboards/my-rank
```

---

### 🗣️ Community Forum (Terminal-Style)

The **Community Forum** presents discussions in a retro terminal interface, creating an immersive, hacker-aesthetic experience.

**How It Works:**
1. Users enter the "Community Terminal"
2. Type commands to search vulnerabilities or browse categories
3. Select a vulnerability to view or create discussion threads
4. Post comments, get upvotes, and earn reputation points

**Command System:**
```bash
$ help                      # Show available commands
$ list categories          # View all vulnerability categories
$ search <query>           # Search for vulnerabilities or categories
$ <category name>          # View vulnerabilities in a category
$ <vulnerability name>     # Open discussion thread
$ back                     # Return to welcome screen
$ clear                    # Clear terminal history
```

**Engagement Features:**
- **Thread Creation**: Discuss any vulnerability with context
- **Upvoting & Liking**: Comments and posts can be voted on
- **Reputation System**: Likes (+1 point), upvotes (+2 points)
- **Cross-Linking**: Tag vulnerabilities directly (e.g., `#langflow/CVE-2025-3248`)
- **Category Filtering**: Browse by technology/platform

**Visual Design:**
- Dramatic welcome overlay with typing animation asking "What knowledge do you seek?"
- Matrix-green terminal aesthetic with glowing text
- Smooth transitions between views
- Real-time updates to community content

---

### 🏅 Badge System

The **Badge System** rewards achievement across multiple dimensions, encouraging students to diversify their learning.

**Badge Tiers:**
- **Bronze**: Entry-level achievements (5-10 points)
- **Silver**: Intermediate mastery (25-50 points)
- **Gold**: Advanced skills (100+ points)
- **Platinum**: Expert level (250+ points)

**Achievement Types:**
1. **Points-Based**: Accumulate XP through submissions
2. **Category Mastery**: Complete challenges in specific domains
3. **CVE Specialist**: Solve multiple vulnerabilities of same type
4. **Route Completion**: Successfully exploit entire vulnerability chains
5. **Streak Badges**: Maintain consecutive day/week streaks

**Visual Features:**
- **Animated Cards**: Each badge has unique animation
  - 🔄 Shimmer effect (entry badges)
  - 🌀 Rotating orbit (progression badges)
  - ✨ Glowing aura (achievement badges)
  - 🎆 Flare bursts (mastery badges)
- **Progress Bars**: Show percentage toward unlock criteria
- **Locked State**: Grayscale badges with lock icon until earned
- **Reveal Animation**: Dramatic unlock animation when achieved

**Example Badges:**
- "First Blood" - Complete your first challenge
- "CVE Researcher" - Solve 10 different CVE challenges
- "Security Expert" - Earn 500 points
- "Community Champion" - Get 50 upvotes on forum posts
- "Speed Runner" - Complete a challenge in under 5 minutes

---

### 📊 Submission & Grading System

The **Submission System** allows students to submit proofs of exploitation, while the **Grading Console** enables instructors to review, approve, and provide feedback.

**Student Workflow:**
1. Select a challenge from the challenges list
2. Complete the vulnerability exploitation
3. Upload proof (screenshots, logs, or reports)
4. Add written explanation (optional)
5. Submit for grading

**Instructor/Grader Workflow:**
1. Access the Grading Console (`/grading`)
2. Filter submissions by:
   - Status: Pending, Approved, Rejected, Returned
   - Challenge: Filter by specific vulnerability
   - User: View submissions from specific students
3. Review submission details and proof
4. Approve, reject, or request revisions
5. Add feedback comments
6. Score is automatically updated → Points awarded → Leaderboard updates

**Key Features:**
- **File Upload Support**: Attach multiple proof files (images, PDFs, logs)
- **Rich Comments**: Provide detailed feedback to students
- **Bulk Operations**: Grade multiple submissions at once
- **Audit Trail**: Track all approvals and feedback
- **Auto-Scoring**: Points calculated based on challenge difficulty + approval time

---

### 👤 User Profiles & Progress Tracking

The **Profile System** provides personalized progress tracking and achievement display.

**Profile Information:**
- **User Stats**:
  - Total points earned
  - Current level/rank
  - Submission count
  - Badge collection progress
- **Category Progress**: Visual breakdown of challenges completed per category
- **Recent Submissions**: Latest challenge submissions with status
- **Badge Gallery**: All earned badges with dates and animation
- **Bio & Avatar**: Customizable profile information

**Profile Editing:**
- Update display name
- Upload custom avatar
- Add bio/about section
- Set learning goals (optional)
- View achievement timeline

**User Levels:**
- **Levels 1-5**: Based on total points earned
- **Title Progression**: "Novice" → "Apprentice" → "Adept" → "Expert" → "Master"
- **Milestone Badges**: Earned at specific level thresholds

---

### 📚 Resources & Documentation

The **Resources Page** provides students with essential reference materials and quick-start guides.

**Included Resources:**
- VulHub Quick Start guide with links
- Challenge categories explanation
- Badge tier requirements
- Community forum guidelines
- FAQ section
- External security resources

---

### 🔐 Authentication & Security

**Authentication Features:**
- **Email-Based Login**: Secure email/password authentication
- **JWT Tokens**: Access tokens and refresh tokens for API security
- **Token Management**: Automatic token refresh with expiration handling
- **Session Persistence**: Maintains login across page reloads
- **Logout**: Clear tokens and session data

**Security Measures:**
- HTTPS enforced in production
- CORS configured for safe cross-origin requests
- Content Security Policy (CSP) headers
- XSS protection
- CSRF token validation
- Rate limiting on authentication endpoints
- Password validation (in backend)

---

## Technical Architecture

### Frontend Stack

```
Next.js 14 (React 18)
├── App Router (modern file-based routing)
├── TypeScript (type safety)
├── Tailwind CSS (styling)
├── Lucide React (icons)
├── React Query (data fetching & caching)
├── Zustand (state management)
└── Custom hooks (API integration, error handling)
```

### Backend Stack

```
NestJS (Node.js framework)
├── TypeScript
├── PostgreSQL (database)
├── Prisma (ORM)
├── JWT (authentication)
├── Helmet (security)
└── Swagger (API documentation)
```

### Database Schema

**Core Tables:**
- `users` - Student accounts and authentication
- `projects` - Challenges/vulnerabilities
- `submissions` - Student submissions and grading status
- `badges` - Badge definitions and progress
- `user_badges` - Earned badges tracking
- `leaderboard_entries` - Cached leaderboard data

**Key Relationships:**
```
User → Submissions → Projects (Challenges)
User → Badges (earned via submission completion)
User → Leaderboard (updated via points calculation)
```

### API Architecture

The API follows RESTful principles with the following structure:

```
/api/v1/
├── /auth (authentication: login, register, refresh)
├── /users (profile management)
├── /projects (challenges list & details)
├── /submissions (student submissions)
├── /leaderboards (rankings & scores)
├── /badges (badge system)
└── /health (system status)
```

### Key Technologies & Justifications

| Technology | Purpose | Why Chosen |
|-----------|---------|-----------|
| **Next.js** | React meta-framework | Server-side rendering, API routes, automatic optimization |
| **NestJS** | Backend framework | Enterprise patterns, TypeScript, scalable architecture |
| **PostgreSQL** | Database | Reliability, ACID compliance, excellent for relational data |
| **Prisma** | ORM | Type-safe queries, easy migrations, excellent DX |
| **Tailwind CSS** | Styling | Utility-first, rapid development, responsive design |
| **React Query** | Data fetching | Automatic caching, refetching, mutation handling |

---

## 📚 Documentation

> **🚀 New to VulHub?** Check out our comprehensive documentation below!

### Quick Start Guides

| Guide | Purpose | Time | Best For |
|-------|---------|------|----------|
| **[README_STARTUP_SIMPLIFIED.md](./README_STARTUP_SIMPLIFIED.md)** ⭐ | **START HERE!** Simple one-command startup | 2 min | Everyone |
| [QUICK_START_LOCAL_DEVELOPMENT.md](./QUICK_START_LOCAL_DEVELOPMENT.md) | Detailed local development setup | 10 min | First-time users |
| [STARTUP_COMMANDS_CHEATSHEET.md](./STARTUP_COMMANDS_CHEATSHEET.md) | Quick reference for common commands | 1 min | Quick lookup |
| [STARTUP_IMPROVEMENT_SUMMARY.md](./STARTUP_IMPROVEMENT_SUMMARY.md) | Technical details of startup system | 5 min | Developers |

### Testing & Deployment

| Guide | Purpose |
|-------|---------|
| [LOCAL_TESTING_GUIDE.md](./LOCAL_TESTING_GUIDE.md) | Complete testing checklist |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Production deployment instructions |

### Authentication System

| Guide | Purpose |
|-------|---------|
| [AUTH_TESTING_GUIDE.md](./AUTH_TESTING_GUIDE.md) | Authentication testing procedures |
| [DEEP_DIVE_AUTH_ISSUES.md](./DEEP_DIVE_AUTH_ISSUES.md) | Auth system analysis and fixes |
| [PERFECT_FIX_IMPLEMENTATION_PLAN.md](./PERFECT_FIX_IMPLEMENTATION_PLAN.md) | Detailed auth implementation |
| [FIX_IMPLEMENTATION_COMPLETE.md](./FIX_IMPLEMENTATION_COMPLETE.md) | Auth completion report |

### Architecture & Design

| Guide | Purpose |
|-------|---------|
| [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md) | Complete architecture overview |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | UI/UX design system |
| [SECURITY.md](./SECURITY.md) | Security policies and best practices |

### Latest Updates

| Document | Purpose |
|----------|---------|
| [FINAL_COMPLETION_REPORT.md](./FINAL_COMPLETION_REPORT.md) | Most recent improvements and status |
| [DOCUMENTATION_CLEANUP_PLAN.md](./DOCUMENTATION_CLEANUP_PLAN.md) | Documentation consolidation details |

---

## Getting Started

> **⚡ Fastest way to start:** Just run `npm run dev:local` (see [README_STARTUP_SIMPLIFIED.md](./README_STARTUP_SIMPLIFIED.md))

### Prerequisites

Before running the application, ensure you have:

- **Node.js** 18.0 or higher ([download](https://nodejs.org/))
- **pnpm** 8.0 or higher (recommended over npm for monorepo support)
  ```bash
  npm install -g pnpm
  ```
- **Git** for cloning the repository

**For Local Development:**
- **PostgreSQL** 14+ OR **SQLite** (automatic fallback) OR **Docker Desktop**
- **Redis** (optional, app works fine without it using in-memory fallback)

**For Production Deployment:**
- See [FREE_PLATFORMS_SETUP_GUIDE.md](./FREE_PLATFORMS_SETUP_GUIDE.md) for free hosting options

### Installation

#### Option 1: Local Development (Recommended for Testing)

> **💡 For the fastest setup, see [QUICK_START.md](./QUICK_START.md)**

**Step 1: Clone the repository**
   ```bash
   git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
   cd VulHub-LeaderBoard-Web
   ```

**Step 2: Install dependencies**
   ```bash
   pnpm install
   ```

**Step 3: Set up environment variables**

**Frontend:** Copy the example file and customize:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

The example file includes:
```bash
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NODE_ENV=development
```

**Backend:** Copy the example file and customize:
```bash
cp apps/api/.env.example apps/api/.env
```

Then update the database connection in `apps/api/.env`:
- **With Docker Compose** (recommended): Already configured in example
- **With Local PostgreSQL**: Update `DATABASE_URL` to your local database
- **Other required vars**: `JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`, `TENANT_ID`

See [QUICK_START.md](./QUICK_START.md) for detailed environment setup.

**Step 4: Set up the database**

If using Docker Compose:
```bash
# Start PostgreSQL and Redis
pnpm dev:stack

# Wait 10 seconds for services to start
```

Then set up the database schema:
```bash
cd apps/api
pnpm prisma generate      # Generate Prisma client
pnpm prisma db push       # Create database tables
pnpm db:seed              # Load test data (users, challenges, etc.)
cd ../..
```

**Step 5: Run development servers**
```bash
# From project root, this starts both frontend and API
pnpm dev
```

**Access Points:**
- Frontend: **http://localhost:3010**
- API: **http://localhost:4010/api/v1**
- Health Check: **http://localhost:4010/api/v1/health**

**Test Login Credentials** (after seeding):
- Email: `admin@example.com`
- Password: `password123`

#### Option 2: Docker Setup

For a fully containerized development environment:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Services will be available at:
- Frontend: http://localhost:3010
- API: http://localhost:4010/api/v1
- PostgreSQL: localhost:5433
- Redis: localhost:6380

---

## Project Structure

```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── web/                          # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/                  # Page routes and layouts
│   │   │   │   ├── page.tsx          # Dashboard/Leaderboard home
│   │   │   │   ├── community/        # Community forum
│   │   │   │   ├── challenges/       # Challenges list
│   │   │   │   ├── submissions/      # User submissions
│   │   │   │   ├── badges/           # Badge gallery
│   │   │   │   ├── profile/          # User profile
│   │   │   │   ├── grading/          # Instructor grading console
│   │   │   │   └── resources/        # Documentation & resources
│   │   │   ├── components/           # Reusable React components
│   │   │   ├── lib/                  # Utility functions & hooks
│   │   │   │   ├── api/              # API client & endpoints
│   │   │   │   ├── auth/             # Authentication logic
│   │   │   │   └── hooks/            # Custom React hooks
│   │   │   └── styles/               # Global styles
│   │   └── public/                   # Static assets
│   │
│   └── api/                          # NestJS backend application
│       ├── src/
│       │   ├── common/               # Shared utilities
│       │   │   ├── guards/           # Auth, rate limiting
│       │   │   ├── interceptors/     # Logging, response transform
│       │   │   └── filters/          # Error handling
│       │   ├── modules/              # Feature modules
│       │   │   ├── auth/             # Authentication
│       │   │   ├── users/            # User management
│       │   │   ├── projects/         # Challenges/vulnerabilities
│       │   │   ├── submissions/      # Grading & submissions
│       │   │   ├── leaderboards/     # Rankings
│       │   │   └── badges/           # Badge system
│       │   ├── prisma/               # Database schema
│       │   └── main.ts               # Application entry point
│       └── package.json
│
├── DEPLOYMENT_GUIDE.md               # Production deployment (45 min guide)
├── SUPABASE_SETUP.md                 # Database setup (Supabase)
├── HEROKU_DEPLOYMENT.md              # API deployment (Heroku)
├── VERCEL_DEPLOYMENT.md              # Frontend deployment (Vercel)
├── POST_DEPLOYMENT_CHECKLIST.md      # Verification steps
├── Procfile                          # Heroku process definition
├── vercel.json                       # Vercel configuration
├── docker-compose.dev.yml            # Docker development setup
└── pnpm-workspace.yaml               # Monorepo workspace config
```

---

## API Documentation

### Authentication Endpoints

**POST** `/api/v1/auth/login`
```json
Request:
{
  "email": "student@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "student@example.com",
      "name": "Student Name",
      "points": 150,
      "level": 2
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

**POST** `/api/v1/auth/register`
```json
Request:
{
  "email": "newstudent@example.com",
  "password": "securepassword123",
  "name": "New Student"
}

Response (201): Same as login response
```

### Leaderboard Endpoints

**GET** `/api/v1/leaderboards`
Returns top 15 users with their stats
```json
Response (200):
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "userId": "uuid",
      "name": "Top Scorer",
      "points": 5000,
      "submissions": 42,
      "badges": 12,
      "streak": 15
    },
    ...
  ]
}
```

**GET** `/api/v1/leaderboards/my-rank`
Returns current user's rank and stats
```json
Response (200):
{
  "success": true,
  "data": {
    "rank": 23,
    "userId": "uuid",
    "name": "Your Name",
    "points": 850,
    "submissions": 8,
    "badges": 3,
    "streak": 5
  }
}
```

### Projects (Challenges) Endpoints

**GET** `/api/v1/projects`
Get all available challenges with pagination
```bash
# Query parameters
/api/v1/projects?page=1&limit=10&category=web&difficulty=medium
```

**GET** `/api/v1/projects/:id`
Get specific challenge details

### Submissions Endpoints

**POST** `/api/v1/submissions`
Create a new submission
```json
Request:
{
  "projectId": "uuid",
  "content": "Proof of exploitation details",
  "files": [/* file attachment data */]
}

Response (201):
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "userId": "uuid",
    "status": "pending",
    "createdAt": "2025-10-31T12:00:00Z"
  }
}
```

**GET** `/api/v1/submissions/my-submissions`
Get current user's submissions

**GET** `/api/v1/leaderboards/stats`
Get submission and engagement statistics

### Badges Endpoints

**GET** `/api/v1/badges`
Get all available badges

**GET** `/api/v1/badges/my-badges`
Get earned badges for current user

**GET** `/api/v1/badges/my-progress`
Get progress toward badges not yet earned

### Health Check

**GET** `/api/v1/health`
System health status
```json
Response (200):
{
  "status": "ok",
  "info": {
    "api": {
      "status": "up",
      "message": "API is running"
    }
  }
}
```

---

## Testing the Application

### 1. Test Local Development Setup

**Verify the API is running:**
```bash
curl http://localhost:4010/api/v1/health

# Expected response
# {"status":"ok","info":{"api":{"status":"up","message":"API is running"}}}
```

**Verify the frontend is running:**
Open http://localhost:3010 in your browser. You should see the login page.

### 2. Authentication Testing

**Test Login:**
1. Go to http://localhost:3010
2. Use test credentials:
   - Email: `admin@example.com`
   - Password: `password123`
3. Click "Login"
4. Should redirect to dashboard with leaderboard visible

**Expected Results:**
- ✅ Dashboard loads
- ✅ Leaderboard shows 15 top users
- ✅ Your profile appears in quick stats
- ✅ No console errors (F12)

### 3. Feature Testing Checklist

#### Leaderboard Page
- [ ] Page loads without errors
- [ ] Shows top 15 rankings
- [ ] User rank is highlighted
- [ ] Points and badges display correctly
- [ ] "Start Competing" button navigates to challenges
- [ ] "Join Community" button navigates to community

#### Community Page
- [ ] Welcome terminal animation displays
- [ ] Type `help` command works
- [ ] Type `list categories` shows categories
- [ ] Can search for vulnerabilities
- [ ] Can click into a category
- [ ] Can view vulnerabilities in category
- [ ] Terminal aesthetic looks good (matrix-green theme)

#### Challenges Page
- [ ] Lists available challenges
- [ ] Can filter by category
- [ ] Can view challenge details
- [ ] Can click "Start Challenge" button
- [ ] Difficulty levels display correctly

#### Submissions Page
- [ ] Shows submission history
- [ ] Status labels (pending, approved, etc.) display
- [ ] Can view submission details
- [ ] Can upload new submission (if applicable)

#### Badges Page
- [ ] All badges display
- [ ] Locked badges shown in grayscale
- [ ] Progress bars visible
- [ ] Earned badges highlighted
- [ ] Animations work smoothly

#### Profile Page
- [ ] Displays user information
- [ ] Shows stats (points, level, submissions)
- [ ] Shows earned badges
- [ ] Can edit profile (if permission granted)
- [ ] Category progress displays correctly

#### Navigation
- [ ] All header links work (Community, Challenges, Badges, etc.)
- [ ] Browser back button works
- [ ] Logout clears tokens
- [ ] After logout, redirects to login page

### 4. API Testing with cURL

**Test authentication:**
```bash
# Login
curl -X POST http://localhost:4010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Extract accessToken from response
# Use it for authenticated requests:
export TOKEN="your_access_token_here"

# Test leaderboard
curl http://localhost:4010/api/v1/leaderboards \
  -H "Authorization: Bearer $TOKEN"

# Test user's rank
curl http://localhost:4010/api/v1/leaderboards/my-rank \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Browser DevTools Testing

**Console Tab (F12):**
- Should have no red errors
- Should show info/debug logs but no critical errors
- Check for CORS issues (if any)

**Network Tab (F12):**
- All requests should return 2xx or 3xx status codes
- API requests should go to `localhost:4010` (not localhost:3000)
- No failed requests (red indicators)
- Response times should be < 2 seconds

**Application Tab:**
- LocalStorage should contain:
  - `auth_token` (JWT token)
  - `user_data` (stringified user object)
- No sensitive data exposed in logs

### 6. Performance Testing

**Page Load Times:**
- Dashboard should load in < 2 seconds
- Community page should load in < 2 seconds
- Leaderboard should show within 1 second

**API Response Times:**
- `/leaderboards` should respond in < 500ms
- `/my-rank` should respond in < 500ms
- Login should respond in < 1 second

---

## Deployment

### 🆓 Free Hosting Options (Updated 2025)

The application can be deployed using **modern cloud platforms**. If using your paid Heroku account, costs start at **$7-50/month**:

| Component | Platform | Cost | Time | Status |
|-----------|----------|------|------|--------|
| **Frontend** | Vercel | FREE | 5 min | 🟢 Ready |
| **API** | Heroku (Paid Account) | $7-50/mo | 10 min | 🟢 Ready |
| **Database** | Supabase | FREE | 5 min | 🟢 Ready |
| **Redis** | Heroku Redis addon (optional) | 0-15/mo | 3 min | 🟡 Optional |
| **Total** | | **$7-50/month** | **25-30 min** | ✅ Complete |

**Alternative:** 100% free ($0/month) using Render (free tier, may have cold starts) + Vercel + Supabase

### 📚 Deployment Documentation

**Start Here:**
1. **[FREE_PLATFORMS_SETUP_GUIDE.md](./FREE_PLATFORMS_SETUP_GUIDE.md)** ⭐ Complete guide with Heroku setup instructions
2. **[PRODUCTION_READINESS_ASSESSMENT.md](./PRODUCTION_READINESS_ASSESSMENT.md)** - Launch readiness checklist
3. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Architecture overview and deployment process

**Platform-Specific Guides:**
- **Database:** Supabase (free PostgreSQL), Heroku PostgreSQL addon, or Neon (free)
- **Frontend:** Vercel (made for Next.js, 100% free)
- **Backend:** Heroku (using your paid account - recommended), Render (free, with limitations), or Railway (free trial)
- **Optional:** Heroku Redis, Upstash Redis (free), or Cloudinary (free file storage)

### 🎯 Recommended Launch Stack

#### **Option A: Using Your Paid Heroku Account (Recommended ⭐)**
```
Frontend:  Vercel (free)
Backend:   Heroku (paid - your account)
Database:  Supabase (free, 500MB) or Heroku PostgreSQL addon
Redis:     Heroku Redis addon (optional)
Cost:      $7-50/month
Status:    Always-on, Professional-grade
```

#### **Option B: 100% Free Alternative**
```
Frontend:  Vercel (free)
Backend:   Render (free, auto-sleeps after 15 min)
Database:  Supabase (free, 500MB)
Cost:      $0/month
Status:    ⚠️ May have slow cold starts
```

### Required External Services

Based on your code, here's what you **must** set up:

#### ✅ **Required:**
1. **PostgreSQL Database** - Supabase (free), Heroku PostgreSQL addon, or Neon (free)
2. **Frontend Hosting** - Vercel (free)
3. **Backend Hosting** - Heroku (paid account recommended), Render (free), or Railway (free trial)

#### 🟡 **Optional (App Works Without):**
1. **Redis** - Heroku Redis addon, Upstash (free), or skip (app has in-memory fallback)
2. **Email** - Resend/SendGrid (free), or use in-app notifications only
3. **File Storage** - Cloudinary (free) or local storage

### Production Checklist

Before going live:
- [ ] ✅ Set up free database (Supabase) or Heroku PostgreSQL addon
- [ ] ✅ Deploy frontend to Vercel
- [ ] ✅ Deploy backend to Heroku
- [ ] ✅ Set all environment variables (see [FREE_PLATFORMS_SETUP_GUIDE.md](./FREE_PLATFORMS_SETUP_GUIDE.md))
- [ ] ✅ Run database migrations
- [ ] ✅ Test authentication (login/logout)
- [ ] ✅ Verify API health endpoint
- [ ] ✅ Test core features (leaderboard, submissions, badges)
- [ ] ✅ Verify HTTPS everywhere
- [ ] 🟡 Optional: Add Heroku Redis addon for caching
- [ ] 🟡 Optional: Configure email service

---

## Contributing

We welcome contributions! Here's how to help:

### Development Workflow

1. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test locally:
   ```bash
   pnpm dev
   ```

3. **Commit with clear messages:**
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. **Push and create a Pull Request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, missing semicolons, etc.)
- `refactor:` Code refactor
- `test:` Test additions/changes
- `chore:` Build, dependencies, etc.

### Code Standards

- Use TypeScript (no `any` types without justification)
- Write unit tests for new features
- Follow existing code style
- Run `pnpm lint` before committing
- Add JSDoc comments for public functions

---

## Support & Troubleshooting

### Common Issues

#### Issue: "Cannot find module '@nestjs/cli'"
**Solution**: Ensure you've run `pnpm install` in the project root
```bash
pnpm install
```

#### Issue: "ENOENT: no such file or directory"
**Solution**: Clear cache and reinstall:
```bash
rm -rf .next node_modules/.cache apps/web/.next
pnpm install
```

#### Issue: "Cannot connect to database"
**Solution**: Verify DATABASE_URL in `.env`:
```bash
cat apps/api/.env | grep DATABASE_URL
```
Also check that PostgreSQL is running.

#### Issue: "API not reachable from frontend"
**Solution**: Check NEXT_PUBLIC_API_URL:
```bash
cat apps/web/.env.local | grep NEXT_PUBLIC_API_URL
```
Should be: `http://localhost:4010/api/v1`

#### Issue: "Port already in use"
**Solution**: Check what's running on the port:
```bash
# macOS/Linux
lsof -i :3010
lsof -i :4010

# Windows
netstat -ano | findstr :3010
netstat -ano | findstr :4010
```

Kill the process or use different ports in `.env` files.

### Getting Help

1. **Check the logs**:
   ```bash
   # Terminal running pnpm dev
   # Check for error messages
   ```

2. **Check browser console** (F12):
   - Network tab for API errors
   - Console for JavaScript errors

3. **Check API logs**:
   ```bash
   # Look for startup messages and errors
   ```

4. **Create an issue** on GitHub with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Operating system and Node.js version
   - Browser and DevTools information

---

## Project Status & Roadmap

### ✅ Completed Features (Beta)
- Authentication (login/registration)
- Live leaderboard with real-time updates
- Community forum with terminal interface
- Badge system with animations
- User profiles and progress tracking
- Submission and grading system
- Responsive design
- Security headers and CORS

### 🚀 Planned Features (Post-Launch)
- Admin dashboard for site management
- Advanced analytics and reporting
- Mobile app (React Native)
- Two-factor authentication (2FA)
- Social features (follows, messaging)
- Challenge difficulty scaling
- Team/group competitions
- API webhooks for integrations
- Dark mode toggle
- Internationalization (i18n)

### 📋 Known Limitations
- Free tier databases (Supabase) have storage limits
- Rate limiting is generous in development
- Some advanced analytics features are placeholder
- Mobile responsiveness could be enhanced further

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## Acknowledgments

### Special Thanks

**🎓 VulHub Team** - A huge thank you to the VulHub team who created the exceptional cybersecurity activities, challenges, and vulnerability labs that make this leaderboard platform possible. Their dedication to hands-on security education provides the foundation for this gamified learning experience.

### Technology & Tools

- Built with [Next.js](https://nextjs.org/), [NestJS](https://nestjs.com/), and [PostgreSQL](https://www.postgresql.org/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Inspired by modern gamification and cybersecurity education best practices

---

## Contact & Support

For questions, bug reports, or feature requests:
- **GitHub Issues**: [Create an issue](https://github.com/des-work/VulHub-LeaderBoard-Web/issues)
- **Email**: Contact project maintainers
- **Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed info

---

<div align="center">

**Made with ❤️ for cybersecurity education**

[⬆ Back to top](#vulhub-leaderboard-web-application)

</div>
