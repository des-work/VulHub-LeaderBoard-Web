# 🏰 VulHub Leaderboard

**A modular, secure, and gamified platform for cybersecurity students to practice, compete, and grow.**

VulHub Leaderboard is a full-stack web application designed to track student progress on VulHub vulnerability challenges.  
It enables real-time leaderboards, secure authentication, gamified achievements, and transparent scoring — all built with extensibility in mind.

---

## 🧠 Overview

See detailed app docs in `apps/web/README.md`.

---

## 🧑‍💻 Development Setup

### 🐳 **Docker Setup (Recommended)**

**Quick Start:**
```bash
git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
cp env.example .env || true
docker-compose -f docker-compose.dev.yml up --build
```

**Access URLs:**
- Website: http://localhost:4010 (if configured) or http://localhost:3000 for dev
- API: http://localhost:4000/api/health (if backend present)

### 🛠 **Local Development Setup**
```bash
# Clone and run
git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
pnpm install
pnpm -r dev
```

Verify:
- Web → http://localhost:3000
- API → http://localhost:4000/api/health (optional)

For additional guides and docs, see `apps/web/README.md` and `apps/web/src/docs/`.
