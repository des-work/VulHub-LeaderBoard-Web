# ADR-000: Tech Stack
Status: Proposed
Context: Monorepo (pnpm, Turborepo), Next.js (web), NestJS (API), Prisma/Postgres, Redis, S3, BullMQ, OpenAPI+Zod.
Decision: Adopt the stack above to maximize type safety, modularity, and scalability.
Consequences: Consistent TypeScript across stack; requires infra for Postgres/Redis.
