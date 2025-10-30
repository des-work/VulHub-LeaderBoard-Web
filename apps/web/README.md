# VulHub Leaderboard

A gamified cybersecurity learning platform where students compete, learn, and grow through real-world vulnerability challenges.

## 🎯 Overview

VulHub Leaderboard centers on three pillars:
- A spectacular, live leaderboard
- A community forum tied to Vulhub environments
- A rich, animated badge system with progress‑to‑unlock

## ✨ Core Features

### 🏆 Live Leaderboard (the star of the show)
- Top 15 view by default with pop‑culture dummy profiles (Neo, Trinity, Morpheus...)
- Spectacular row cards with a dedicated badge/notification lane (no overlap)
- Dynamic indicators: On‑Fire, Streak, Close‑Match (non‑blocking, animated)
- Stacked progress bars and rank icons (Crown/Medals/Trophies)

### 🗣️ Community Forum
- Threads grouped by Vulhub environments with quick environment filter
- Topic cards show upvotes/likes/comment counts; posts and comments can tag Vulhub paths (e.g., `langflow/CVE-2025-3248`)
- Engagement → points: likes (+1) and upvotes (+2) reward authors and affect leaderboard
- New Topic and Comment flows with tag chips linking to the corresponding Vulhub path

### 🏅 Badges (animated + progress‑aware)
- Card system with unique animated art per badge (shimmer/rotate/glow/orbit/flare)
- Locked badges are grayscale with a lock tag; unlock with animated reveal
- Per‑requirement progress bars (points now; categories/CVE/route/streak ready)
- Tiers (Bronze/Silver/Gold/Platinum) and rules for points, category counts, CVE and route‑steps

### 📊 Submissions & Grading
- File uploads as proof; link to challenges
- Grading console with filters, standardized SubmissionsTable
- Approved grades update scores and rankings instantly

### 🔐 Profiles & Auth
- Edit profile (display name, avatar URL, bio)
- Profiles show points, level, category progress, badges, and submissions
- Server‑first with resilient fallback to local storage

### 📚 Resources
- Built‑in resources page summarizing Vulhub Quick Start with proper credits

## 🧭 Key Pages
- `/` Home + Live Leaderboard
- `/community` Community forum (environment filter, thread cards)
- `/badges` Animated badges with progress‑to‑unlock
- `/grading` Grading console (graders/admin only)
- `/profile` Student profile and editing
- `/resources` Vulhub quick‑start & documentation links

## 🏗️ Architecture & Tech Details

### Frontend Stack
- **Next.js 14** (App Router) • **TypeScript** • **Tailwind CSS** • **Lucide React** • **OGL** (background effects)

### Key Components
- Leaderboard: `SpectacularLeaderboard`, `StackedBarChart`
- Community: `ForumProvider`, environment filter, thread cards, topic/comment flows
- Badges: animated cards, `evaluateBadges` for unlocks with progress bars
- Grading: `GradingProvider`, `GradingDashboard`, reusable `SubmissionsTable`
- Profiles: `/profile` with edit modal, progress and badges
- Design System: `globals.css` effects, fonts utils

### Resilience & Security
- Resilient API client (timeout, retry, circuit‑breaker) with server‑first providers and local fallback
- ErrorBoundary + `useAsync` hook for robust error/abort handling
- Security headers middleware (CSP, frame/referrer, HSTS on HTTPS)
- Sanitization helpers for user‑generated content

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
   cd VulHub-LeaderBoard-Web
   ```

2. **Install dependencies**
   ```bash
   cd apps/web
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Docker Setup (Alternative)
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## 🔧 Configuration

Create `apps/web/.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Optional backend if available
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 📚 Documentation
- Leaderboard & Effects: see `SpectacularLeaderboard` and `globals.css`
- Community Forum: [docs/community.md](./src/docs/community.md)
- Badges & Progress: [docs/challenges-badges.md](./src/docs/challenges-badges.md)
- Grading System: [docs/grading.md](./src/docs/grading.md)
- Design & Customization: [docs/design-system.md](./src/docs/design-system.md), [docs/customization-guide.md](./src/docs/customization-guide.md)
- Security: [docs/security.md](./src/docs/security.md)

## 📄 License & Credits
- MIT License (see LICENSE)
- Challenge catalog references the official Vulhub environments: [https://vulhub.org/environments](https://vulhub.org/environments)
- Credit to the Vulhub team and contributors for their work and documentation