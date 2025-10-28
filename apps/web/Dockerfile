# ===== Base Stage =====
# Sets up Node.js, pnpm, and a non-root user for security.
FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# ===== Dependencies Stage =====
# Installs production dependencies, leveraging Docker cache.
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch
RUN pnpm install -r --prod --filter=@vulhub/web

# ===== Builder Stage =====
# Builds the Next.js application for production.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter=@vulhub/web build

# ===== Production Stage =====
# Creates the final, lightweight image with only what's needed to run.
FROM base AS production

ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Use the non-root user
USER appuser

# Expose the port the web app will run on
EXPOSE 3000

# Healthcheck to ensure the web app is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000 || exit 1

# Command to start the application
CMD ["node", "apps/web/server.js"]