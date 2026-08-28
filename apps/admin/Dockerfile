FROM docker.io/oven/bun:1.3.6 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM docker.io/oven/bun:1.3.6 AS builder
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
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
COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin
RUN bun run build \
  && mkdir -p .next/standalone/.next \
  && cp -R .next/static .next/standalone/.next/static \
  && if [ -d public ]; then cp -R public .next/standalone/public; fi

FROM docker.io/library/node:22-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001
COPY --from=builder --chown=node:node /app/apps/admin/.next/standalone ./
USER node
EXPOSE 3001
CMD ["node", "server.js"]
