# apps/api/Dockerfile

# ---- Base Stage ----
# Use a specific Node.js version for reproducibility.
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# ---- Dependencies Stage ----
# This stage is dedicated to installing dependencies to leverage Docker layer caching.
FROM base AS deps
WORKDIR /usr/src/app

# Copy only dependency-related files from the monorepo root.
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
COPY package.json ./apps/api/

# Fetch all dependencies for the entire monorepo.
# The --frozen-lockfile flag ensures we use the exact versions from the lockfile.
RUN pnpm fetch

# ---- Builder Stage ----
# This stage builds the actual application code.
FROM base AS builder
WORKDIR /usr/src/app

# Copy dependency manifests and the API's package.json again.
COPY --from=deps /usr/src/app/package.json ./
COPY --from=deps /usr/src/app/pnpm-workspace.yaml ./
COPY --from=deps /usr/src/app/apps/api/package.json ./apps/api/

# Copy all source code from the monorepo.
COPY ../../. .

# Install dependencies using the fetched cache.
RUN pnpm install --frozen-lockfile --offline

# Build the API application. The --filter flag is essential for monorepos.
RUN pnpm --filter @vulhub/api build

# Prune dev dependencies to reduce the size of the final node_modules.
RUN pnpm deploy --filter @vulhub/api ./deploy

# ---- Production Stage ----
# This is the final, small, and secure image.
FROM base AS production
WORKDIR /usr/src/app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /usr/src/app/deploy .

EXPOSE 4000
CMD ["node", "dist/main"]