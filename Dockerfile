# syntax=docker/dockerfile:1

# --- Base ---
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# --- Dependencies ---
FROM base AS deps
COPY --link package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# --- Build ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --link . .
RUN rm -rf .output node_modules/.cache node_modules/.vite && pnpm build

# --- Migration dependencies ---
FROM node:22-alpine AS migrate-deps
WORKDIR /deps
RUN npm install drizzle-orm pg

# --- Production ---
FROM node:22-alpine AS production
WORKDIR /app

RUN apk add --no-cache wget && \
    addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

COPY --from=build --chown=appuser:appgroup /app/.output ./.output
COPY --from=build --chown=appuser:appgroup /app/drizzle ./drizzle
COPY --from=migrate-deps --chown=appuser:appgroup /deps/node_modules ./node_modules
COPY --chown=appuser:appgroup scripts/migrate.mjs ./scripts/migrate.mjs
COPY --chown=appuser:appgroup scripts/entrypoint.sh ./scripts/entrypoint.sh
RUN chmod +x ./scripts/entrypoint.sh

USER appuser

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "./scripts/entrypoint.sh"]
