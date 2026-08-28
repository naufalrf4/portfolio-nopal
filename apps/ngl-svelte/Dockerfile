# syntax=docker/dockerfile:1.7
FROM docker.io/oven/bun:1.3.14 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM docker.io/oven/bun:1.3.14 AS builder
WORKDIR /app
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/public-astro/package.json ./apps/public-astro/package.json
COPY apps/links-astro/package.json ./apps/links-astro/package.json
COPY apps/ngl-svelte/package.json ./apps/ngl-svelte/package.json
COPY apps/rag-service/package.json ./apps/rag-service/package.json
COPY apps/live-presence/package.json ./apps/live-presence/package.json
COPY apps/slidedeck/package.json ./apps/slidedeck/package.json
COPY e2e/package.json ./e2e/package.json
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile
COPY apps/ngl-svelte ./apps/ngl-svelte
WORKDIR /app/apps/ngl-svelte
RUN bun run build

FROM docker.io/library/node:22-bookworm-slim AS prod
WORKDIR /app/apps/ngl-svelte
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3003
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/ngl-svelte/package.json ./package.json
COPY --from=builder --chown=node:node /app/apps/ngl-svelte/build ./build
USER node
EXPOSE 3003
CMD ["node", "build"]
