# apps/web/Dockerfile

# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app
RUN npm install -g pnpm

# ---- Dependencies Stage ----
FROM base AS deps
WORKDIR /usr/src/app
COPY ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml ./
COPY package.json ./apps/web/
RUN pnpm fetch

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/package.json ./
COPY --from=deps /usr/src/app/pnpm-workspace.yaml ./
COPY --from=deps /usr/src/app/apps/web/package.json ./apps/web/

COPY ../../. .

RUN pnpm install --frozen-lockfile --offline
RUN pnpm --filter @vulhub/web build

# ---- Production Stage ----
FROM base AS production
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the standalone output from the builder stage.
# Next.js's standalone output bundles everything needed to run the app.
COPY --from=builder /usr/src/app/apps/web/.next/standalone ./
COPY --from=builder /usr/src/app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /usr/src/app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT=3000

CMD ["node", "apps/web/server.js"]