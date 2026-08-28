FROM docker.io/oven/bun:1.3.6 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM docker.io/oven/bun:1.3.6 AS builder
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
COPY apps/links-astro ./apps/links-astro
WORKDIR /app/apps/links-astro
RUN bun run build

FROM docker.io/oven/bun:1.3.6 AS prod
WORKDIR /app/apps/links-astro
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3002
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/links-astro/package.json ./package.json
COPY --from=builder /app/apps/links-astro/dist ./dist
EXPOSE 3002
CMD ["bun", "./dist/server/entry.mjs"]
