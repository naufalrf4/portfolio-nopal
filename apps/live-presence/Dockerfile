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
RUN bun install --frozen-lockfile
COPY apps/live-presence ./apps/live-presence

FROM docker.io/oven/bun:1.3.14 AS prod
WORKDIR /app/apps/live-presence
ENV NODE_ENV=production
ENV PORT=3006
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/live-presence /app/apps/live-presence
USER bun
EXPOSE 3006
CMD ["bun", "run", "start"]
