# apps/worker/Dockerfile

# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /usr/src/app
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
COPY package.json ./apps/worker/
RUN pnpm fetch

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/package.json ./
COPY --from=deps /usr/src/app/pnpm-workspace.yaml ./
COPY --from=deps /usr/src/app/apps/worker/package.json ./apps/worker/

COPY ../../. .

RUN pnpm install --frozen-lockfile --offline

# Build the worker application
RUN pnpm --filter @vulhub/worker build

# Prune dev dependencies
RUN pnpm deploy --filter @vulhub/worker ./deploy

# ---- Production Stage ----
FROM base AS production
WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /usr/src/app/deploy .

CMD ["node", "dist/main"]