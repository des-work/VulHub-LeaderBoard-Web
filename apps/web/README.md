# VulHub Leaderboard

A gamified cybersecurity learning platform where students compete, learn, and grow through real-world vulnerability challenges.

## 🎯 Overview

VulHub Leaderboard is an interactive web application designed for cybersecurity education. Students can complete vulnerability challenges, submit proof of completion, and compete on a live leaderboard with real-time updates.

## ✨ Features

### 🎮 Gamification
- **Live Leaderboard** - Real-time rankings with stacked bar chart visualization
- **Point System** - Earn points for completing vulnerability challenges
- **Level Progression** - Advance through levels based on achievements
- **Competition** - Compete with other students in a friendly environment

### 🧩 Challenges & Badges
- **Challenge Catalog** mapped to official Vulhub environments ([environments](https://vulhub.org/environments))
- **Completion Routes** (Standard, Red Team, Blue Team) with clear steps
- **Badges** for category mastery, CVE-specific wins, points milestones, and blue-team tasks

### 🔐 Authentication
- **Student Registration** - Sign up with school ID, name, and password
- **Secure Login** - Protected access to the platform
- **User Profiles** - Track individual progress and achievements
- **Tutorial System** - Guided onboarding for new students

### 📊 Submission & Grading
- **File Uploads** - Submit screenshots, images, or text files as proof
- **Activity/Challenge Linking** - Tie submissions to a Vulhub challenge
- **Grading Console** - Approve/Reject, award points, add feedback
- **Instant Leaderboard Updates** - Scores and ranks update live

### 🗣️ Community
- **Forum** with topics, comments, upvotes/likes
- **Vulhub Tagging** for topics and comments (e.g., `langflow/CVE-2025-3248`) for fast search and cross‑reference

### 📚 Resources
- Built‑in resources page summarizing Vulhub Quick Start and notes with proper credit to Vulhub

### 🎨 Design System
- **Dramatic Typography** - Professional, high‑contrast type system
- **Vibrant Colors** - Purple, red, black, and green color palette
- **Visual Effects** - Subtle glow, professional animations, WebGL background
- **Responsive Design** - Works seamlessly on all devices

## 🧭 Key Pages
- `/` Home + Live Leaderboard
- `/auth` Sign in / Register
- `/grading` Grading console (graders/admin only)
- `/community` Forum with Vulhub tagging
- `/resources` Vulhub quick‑start & documentation links

## 📚 Documentation
- [Design System Guide](./src/docs/design-system.md)
- [Customization Guide](./src/docs/customization-guide.md)
- [Grading System](./src/docs/grading.md)
- [Community Forum](./src/docs/community.md)
- [Challenges & Badges](./src/docs/challenges-badges.md)
- [API Documentation](./src/docs/api.md)

## 🏗️ Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **OGL** - WebGL library for background effects
- **Lucide React** - Icon library

### Key Components

#### Authentication
- `AuthProvider` • `LoginForm` • `RegisterForm` • `TutorialModal`

#### Leaderboard
- `Leaderboard` • `StackedBarChart` • `LeaderboardDisplay` • `SpectacularLeaderboard`

#### Grading
- `GradingProvider` • `GradingDashboard` (filters/table) • Grade modal

#### Community
- `ForumProvider` • Community pages (topic list/detail) • New Topic modal

#### Design System
- `fonts.ts` • `font-utils.ts` • `globals.css` (effects, animations)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
```

## 📄 License & Credits
- MIT License (see LICENSE)
- Challenge catalog references the official Vulhub environments: [https://vulhub.org/environments](https://vulhub.org/environments)
- Credit to the Vulhub team and contributors for their work and documentation