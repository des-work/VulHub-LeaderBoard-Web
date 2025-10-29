# Simplified Dockerfile for VulHub Leaderboard
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm@8.10.0

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/schema/package.json ./packages/schema/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Development stage
FROM base AS development

# Expose ports
EXPOSE 3000 4000

# Default command for development
CMD ["pnpm", "dev"]

# Production stage for API
FROM base AS api-production

# Build packages individually to avoid monorepo issues
RUN cd packages/schema && pnpm install && pnpm build && \
    cd ../utils && pnpm install && pnpm build && \
    cd ../ui && pnpm install && pnpm build && \
    cd ../../apps/api && pnpm install && npx prisma generate && pnpm build && \
    cd ../web && pnpm install && pnpm build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Change ownership
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/v1/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the API
CMD ["sh", "-c", "cd apps/api && pnpm start"]

# Production stage for Web App
FROM base AS web-production

# Build packages individually to avoid monorepo issues
RUN cd packages/schema && pnpm install && pnpm build && \
    cd ../utils && pnpm install && pnpm build && \
    cd ../ui && pnpm install && pnpm build && \
    cd ../../apps/api && pnpm install && npx prisma generate && pnpm build && \
    cd ../web && pnpm install && pnpm build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /usr/src/app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the web app
CMD ["sh", "-c", "cd apps/web && pnpm start"]