# 🏰 VulHub Leaderboard

**A modular, secure, and gamified platform for cybersecurity students to practice, compete, and grow.**

VulHub Leaderboard is a full-stack web application designed to track student progress on VulHub vulnerability challenges.  
It enables real-time leaderboards, secure authentication via CSUSB SSO, gamified achievements, and transparent scoring — all built with enterprise-level architecture principles and extensibility in mind.

---

## 📚 Table of Contents

1. [Overview](#-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Monorepo Structure](#-monorepo-structure)
5. [Architecture Principles](#-architecture-principles)
6. [UI System](#-ui-system)
7. [API Architecture](#-api-architecture)
8. [Security & Compliance](#-security--compliance)
9. [Testing & Quality Assurance](#-testing--quality-assurance)
10. [Observability & Diagnostics](#-observability--diagnostics)
11. [Development Setup](#-development-setup)
12. [Scripts & Commands](#-scripts--commands)
13. [Contributing](#-contributing)
14. [Future Enhancements](#-future-enhancements)
15. [Project Governance](#-project-governance)
16. [License](#-license)

---

## 🧠 Overview

**Purpose:**  
To create a transparent, engaging, and secure leaderboard system that motivates students to learn offensive and defensive cybersecurity through VulHub projects.

**Vision:**  
A highly modular, auditable, and extensible platform where security students can:
- Learn ethical hacking in a safe, controlled environment.
- Compete for rankings and badges.
- Track personal progress and share verified achievements.
- Contribute plugins, modules, or themes without breaking core functionality.

---

## ⚙️ Key Features

### 🎮 Student Experience
- CSUSB **SSO authentication** (OIDC/SAML) for secure access.
- Individual dashboards with project breakdowns and score history.
- Real-time **leaderboards** (overall, project, or category-specific).
- Submission interface with **screenshot uploads**, notes, and scanning pipeline.
- Gamified **badges, achievements, and streak tracking**.

### 🧑‍🏫 Instructor / Admin Experience
- Admin panel to manage users, badges, categories, and seasons.
- Role-based permissions and audit logs for all critical actions.
- Recalculation, reindex, and integrity verification tools.

### 🔐 Security & Reliability
- Hardened OWASP ASVS L2 compliance.
- Row-Level Security (RLS) multi-tenancy for school isolation.
- Presigned S3 uploads with AV scanning and EXIF stripping.
- HTTPS, CSP, HSTS, CSRF, and rate limiting enforced everywhere.

### 📊 Engagement & Analytics
- Project completion metrics and cohort comparisons.
- AI-generated avatars and summaries (optional).
- API for LMS or Discord integration.

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | Next.js 14 + React + TypeScript | SSR/ISR web app |
| **Styling** | TailwindCSS + shadcn/ui + CVA Variants | Modular, themeable design |
| **Backend API** | NestJS (TypeScript) | Domain-driven modular API |
| **Database** | PostgreSQL + Prisma ORM | Relational data, migrations |
| **Cache / RT** | Redis | Caching, sessions, socket Pub/Sub |
| **Storage** | AWS S3 / MinIO | Secure evidence uploads |
| **Jobs** | BullMQ + Worker App | Background jobs & scheduling |
| **Authentication** | OIDC (CSUSB SSO) + JWT/Refresh | Secure user sessions |
| **Telemetry** | OpenTelemetry + Prometheus + Grafana | Monitoring & diagnostics |
| **Testing** | Jest + Playwright + Testcontainers + k6 | Unit, e2e, load, chaos testing |
| **CI/CD** | GitHub Actions + Vercel/Fly.io | Automated build, test, deploy |

---

## 🧩 Monorepo Structure

```bash
vulhub-leaderboard/
├─ apps/
│  ├─ web/                 # Next.js frontend
│  ├─ api/                 # NestJS backend (application/domain/infrastructure)
│  └─ worker/              # BullMQ queue processors
│
├─ packages/
│  ├─ ui/                  # Design system primitives & patterns
│  ├─ schema/              # Zod + OpenAPI DTOs
│  ├─ utils/               # Isomorphic helpers & ports
│  ├─ config/              # Shared ESLint, TS, Tailwind configs
│  ├─ telemetry/           # OpenTelemetry setup
│  └─ plugins/             # Extension surface for badges, scoring, etc.
│
├─ prisma/                 # Database schema, seeds, migrations
├─ infra/                  # Docker, Terraform, K8s manifests
├─ scripts/                # Ingest VulHub, backfills, scaffolds
└─ docs/                   # ADRs, Dev Logs, Runbooks, Standards


🧱 Architecture Principles

Separation of Concerns — clear module boundaries (application, domain, infrastructure).

Ports and Adapters — all external integrations (S3, Redis, IdP) defined as interfaces first.

Event-Driven Core — transactional outbox; eventual consistency with leaderboards.

Multi-Tenancy — enforced by PostgreSQL RLS and scoped Prisma clients.

Security by Default — OWASP ASVS coverage, least-privilege everywhere.

Observability — logs, traces, metrics, and correlation IDs from day one.

Composable UI — everything is slot-based and themable; primitives → patterns → features.

## 🎨 **Unified Design System**

Our UI system represents a **major architectural evolution** - we've eliminated complex theme switching in favor of a **unified, intelligent design system** that provides superior user experience and developer productivity.

### **🎯 Key Achievements**

- ✅ **Unified Experience**: Single, beautiful default UI combining modern, medieval, cyberpunk, and hacker aesthetics
- ✅ **Live Customization**: Real-time editing of colors, effects, typography, and layout without page refresh
- ✅ **Intelligent Components**: Icons, terminology, and effects automatically adapt based on configuration
- ✅ **Persistent Settings**: User preferences saved and restored across sessions
- ✅ **Clean Architecture**: Eliminated theme switching complexity while preserving all aesthetic options

### **🧠 Smart Features**

- **Dynamic Terminology**: Automatic text transformation (user → knight, challenge → quest, etc.)
- **Visual Effects**: Glow, neon, gradient, and shadow effects that respond to configuration
- **Unified Icons**: Single component rendering different icon styles (castle, shield, sword, etc.)
- **CSS Variables**: Dynamic theming using CSS custom properties
- **Live Updates**: Real-time DOM manipulation for instant visual feedback

### **📊 Technical Excellence**

- **TypeScript**: Full type safety with comprehensive configuration interfaces
- **Next.js Compatible**: Proper client/server component handling
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Optimized for production with minimal bundle impact
- **Maintainable**: Clean, scalable architecture for future development

*See full documentation in `packages/ui/README.md`*

🧩 API Architecture (NestJS)

(Section omitted for brevity—see `apps/api/README.md` for deep architecture)

🔐 Security & Compliance

CSUSB OIDC SSO + JWT + RBAC.

Row-Level Security on Postgres for tenant isolation.

Presigned uploads, AV scan, EXIF strip.

Rate limiting, audit logs, encryption-at-rest.

FERPA/GDPR compliant with privacy toggles.

🧪 Testing & Quality Assurance
Level	Tools	Coverage
Unit	Jest/Vitest	60%+
Integration	Testcontainers	Database, RLS, Uploads
E2E	Playwright	Auth, Leaderboard, Admin
Contract	Schemathesis	API correctness
Security	ZAP + CodeQL	OWASP ASVS
Load	k6	Performance
Chaos	Custom Scripts	Resilience
🔭 Observability & Diagnostics

Structured JSON logging (tenant, request, trace IDs).

OpenTelemetry traces and metrics.

Grafana dashboards for RED metrics.

Error budgets and SLO monitoring.

Synthetic health checks & degraded-mode fallback.

🧑‍💻 Development Setup
# Clone and run
git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
pnpm install
pnpm dev:stack      # start local infra
pnpm -r dev         # run all apps in dev


Verify:

Web → http://localhost:3000

API → http://localhost:4000/api/health

🧰 Scripts & Commands
Command	Description
pnpm dev:stack	Launch Docker infra (Postgres, Redis, MinIO)
pnpm dev	Run web and API in dev mode
pnpm test	Run all tests
pnpm lint	Lint + format
pnpm build	Build all apps/packages
pnpm migrate	Apply Prisma migrations
pnpm storybook	View component library
pnpm gen:module <name>	Scaffold API module
pnpm gen:feature <name>	Scaffold UI feature
🤝 Contributing

Fork & clone this repo.

Create a feature branch.

Follow Conventional Commits.

Include an ADR for major changes.

Update /docs/dev-logs/YYYY-MM-DD.md after merge.

## 🏆 **Project Accomplishments**

### **🎯 Major Milestones Achieved**

1. **✅ Unified Design System Implementation**
   - Eliminated complex theme switching system
   - Created single, beautiful default UI combining multiple aesthetics
   - Implemented real-time customization capabilities
   - Built intelligent component composition system

2. **✅ Advanced Customization Features**
   - Live color editing with instant preview
   - Dynamic visual effects (glow, neon, gradient, shadows)
   - Flexible typography system (modern, monospace, serif)
   - Configurable layout spacing and border radius
   - Smart terminology transformation system

3. **✅ Technical Excellence**
   - Full TypeScript support with comprehensive type definitions
   - Next.js compatibility with proper client/server component handling
   - CSS custom properties for dynamic theming
   - Responsive design with mobile-first approach
   - Accessibility compliance (WCAG 2.1 AA)

4. **✅ Developer Experience**
   - Clean, maintainable codebase
   - Comprehensive documentation
   - Storybook integration for component development
   - Hot reloading for instant feedback
   - Type-safe configuration system

5. **✅ Production Readiness**
   - All packages build successfully
   - No TypeScript errors
   - Clean linting
   - Optimized for production deployment
   - Comprehensive testing coverage

### **📊 Code Quality Metrics**

- **Build Status**: ✅ All packages build successfully
- **TypeScript**: ✅ No type errors
- **Linting**: ✅ Clean codebase
- **Accessibility**: ✅ WCAG 2.1 AA compliant
- **Performance**: ✅ Optimized for production
- **Documentation**: ✅ Comprehensive README and Storybook

### **🔧 Technical Implementation**

- **Design Configuration**: Comprehensive config object controlling all UI aspects
- **CSS Variables**: Dynamic theming using CSS custom properties
- **Data Attributes**: DOM attributes for responsive styling
- **React Context**: State management for design configuration
- **Component Composition**: Intelligent components that adapt to configuration
- **Live Updates**: Real-time DOM manipulation for instant visual feedback

## 🚀 Future Enhancements

Team-based leaderboards

AI-driven progress insights

Discord/Slack notifications

Mobile PWA

LMS integrations

🧭 Project Governance

CODEOWNERS per module.

ADRs for architectural decisions.

Dev Logs for traceability.

Security review before release.

Feature flags for progressive delivery.

📜 License

MIT © 2025 — California State University, San Bernardino Cybersecurity Program
Developed by students, for students 🛡️
---
