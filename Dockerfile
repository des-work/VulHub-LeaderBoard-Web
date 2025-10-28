# Multi-stage build for VulHub Leaderboard
FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.10.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/schema/package.json ./packages/schema/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Build all packages
RUN pnpm build

# Production stage for Web App
FROM node:18-alpine AS web-production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.10.0

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/schema/package.json ./packages/schema/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist
COPY --from=builder /app/packages/schema/dist ./packages/schema/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist

# Copy source files needed for runtime
COPY apps/web/src ./apps/web/src
COPY packages/ui/src ./packages/ui/src
COPY packages/schema/src ./packages/schema/src
COPY packages/utils/src ./packages/utils/src
COPY packages/config ./packages/config

# Copy configuration files
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tailwind.config.js ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the web application
CMD ["pnpm", "--filter", "@vulhub/web", "start"]

# Production stage for API
FROM node:18-alpine AS api-production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.10.0

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/schema/package.json ./packages/schema/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/

# Install production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/schema/dist ./packages/schema/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist

# Copy source files needed for runtime
COPY apps/api/src ./apps/api/src
COPY packages/schema/src ./packages/schema/src
COPY packages/utils/src ./packages/utils/src
COPY packages/config ./packages/config

# Copy Prisma schema and generated client
COPY apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Expose port
EXPOSE 4000

# Start the API
CMD ["pnpm", "--filter", "@vulhub/api", "start"]
