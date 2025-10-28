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
RUN pnpm install -r --prod --filter=@vulhub/worker

# ===== Builder Stage =====
# Builds the TypeScript source code into JavaScript.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter=@vulhub/worker build

# ===== Production Stage =====
# Creates the final, lightweight image with only what's needed to run.
FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/package.json ./

USER appuser

CMD ["node", "dist/main.js"]