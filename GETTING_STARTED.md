# 🚀 Getting Started with VulHub Leaderboard

Welcome to the VulHub Leaderboard project! This guide will help you set up your development environment and get started with the project.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **PNPM 8+** - Install with `npm install -g pnpm`
- **Docker & Docker Compose** - [Download Docker Desktop](https://docker.com/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

## 🛠️ Quick Setup

### Option 1: Automated Setup (Recommended)

#### For Windows (PowerShell):
```powershell
# Run the setup script
.\scripts\setup.ps1

# Or with options
.\scripts\setup.ps1 -SkipInfrastructure -SkipDatabase -SkipTests
```

#### For macOS/Linux (Bash):
```bash
# Make the script executable
chmod +x scripts/setup.sh

# Run the setup script
./scripts/setup.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
   cd VulHub-LeaderBoard-Web
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp infra/env.example .env
   # Review and update .env file with your configuration
   ```

4. **Start infrastructure services**
   ```bash
   pnpm dev:stack
   ```

5. **Set up the database**
   ```bash
   pnpm db:migrate
   pnpm db:seed
   ```

6. **Build packages**
   ```bash
   pnpm build
   ```

7. **Start development servers**
   ```bash
   pnpm dev
   ```

## 🌐 Access Points

Once everything is running, you can access:

- **Web Application**: http://localhost:3000
- **API Health Check**: http://localhost:4000/api/health
- **Prisma Studio**: http://localhost:5555
- **MailHog (Email Testing)**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

## 📁 Project Structure

```
vulhub-leaderboard/
├── apps/                    # Applications
│   ├── web/                # Next.js frontend
│   ├── api/                 # NestJS backend
│   └── worker/              # BullMQ workers
├── packages/                # Shared packages
│   ├── ui/                  # UI component library
│   ├── schema/              # Zod validation schemas
│   ├── utils/               # Utility functions
│   ├── config/              # Shared configurations
│   ├── telemetry/           # OpenTelemetry setup
│   └── plugins/             # Extension system
├── prisma/                  # Database schema
├── infra/                   # Infrastructure configs
├── scripts/                 # Development scripts
└── docs/                    # Documentation
```

## 🧪 Development Workflow

### Daily Development

1. **Start your day**
   ```bash
   pnpm dev:stack    # Start infrastructure
   pnpm dev          # Start all applications
   ```

2. **Make changes**
   - Edit code in your preferred editor
   - Changes are automatically reflected
   - Tests run automatically

3. **End your day**
   ```bash
   pnpm dev:stack:down  # Stop infrastructure
   ```

### Working with Database

```bash
# View database in Prisma Studio
pnpm db:studio

# Create a new migration
pnpm db:migrate

# Reset database (careful!)
pnpm db:migrate:reset

# Seed database with sample data
pnpm db:seed
```

### Working with UI Components

```bash
# Start Storybook for component development
pnpm storybook

# Build component library
cd packages/ui && pnpm build
```

## 🧪 Testing

### Run All Tests
```bash
pnpm test
```

### Run Specific Test Suites
```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Performance tests
pnpm test:performance
```

### Test Coverage
```bash
pnpm test:coverage
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all applications in development mode |
| `pnpm build` | Build all packages and applications |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all code |
| `pnpm type-check` | Run TypeScript type checking |
| `pnpm clean` | Clean all build artifacts |
| `pnpm dev:stack` | Start infrastructure services |
| `pnpm dev:stack:down` | Stop infrastructure services |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with sample data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm storybook` | Start Storybook for component development |

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find and kill process using port
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database connection issues**
   ```bash
   # Restart infrastructure
   pnpm dev:stack:down
   pnpm dev:stack
   ```

3. **Package installation issues**
   ```bash
   # Clear cache and reinstall
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

4. **Docker issues**
   ```bash
   # Reset Docker
   docker system prune -a
   docker-compose -f infra/docker-compose.dev.yml up -d
   ```

### Getting Help

- Check the [Development Plan](docs/DEVELOPMENT_PLAN.md)
- Review [Architecture Decision Records](docs/adr/)
- Look at [Dev Logs](docs/dev-logs/)
- Check [Runbooks](docs/runbooks/)

## 🚀 Next Steps

1. **Explore the codebase**
   - Start with the [API documentation](apps/api/README.md)
   - Check out the [UI components](packages/ui/README.md)
   - Review the [database schema](prisma/schema.prisma)

2. **Make your first contribution**
   - Pick a good first issue
   - Create a feature branch
   - Make your changes
   - Submit a pull request

3. **Join the community**
   - Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
   - Participate in discussions
   - Help other developers

## 📚 Additional Resources

- [Project Documentation](docs/README.md)
- [API Documentation](docs/API.md)
- [UI Design System](docs/UI.md)
- [Security Guidelines](docs/SECURITY.md)
- [Performance Guidelines](docs/PERFORMANCE.md)

---

**Happy coding! 🎉**

If you run into any issues, don't hesitate to ask for help in the project discussions or create an issue.
