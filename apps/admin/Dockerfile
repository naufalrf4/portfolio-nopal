# syntax=docker/dockerfile:1.7
FROM docker.io/oven/bun:1.3.14 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM docker.io/oven/bun:1.3.14 AS builder
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=""
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY=""
ARG ADMIN_R2_ACCOUNT_ID=""
ARG ADMIN_R2_BUCKET_NAME=""
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=$NEXT_PUBLIC_VAPID_PUBLIC_KEY
ENV ADMIN_R2_ACCOUNT_ID=$ADMIN_R2_ACCOUNT_ID
ENV ADMIN_R2_BUCKET_NAME=$ADMIN_R2_BUCKET_NAME
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
COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin
# `bun run build` runs `next build --debug-prerender`, a required workaround
# for an unpatched Next.js 16 bug where prerendering the internal
# /_global-error page crashes (vercel/next.js#95741, #86178, #84994) —
# --debug-prerender lets the build actually complete instead of aborting.
# Bun itself then segfaults during its own post-build exit/cleanup on this
# version (unrelated to the build result, and irrelevant at runtime since
# the prod stage below runs the standalone output under plain Node, not
# Bun) — tolerate that crash and verify the real build artifact exists
# instead of trusting bun's exit code.
RUN --mount=type=cache,id=admin-next-cache,target=/app/apps/admin/.next/cache \
  (bun run build || true) \
  && test -f .next/standalone/apps/admin/server.js \
  && mkdir -p .next/standalone/apps/admin/.next \
  && cp -R .next/static .next/standalone/apps/admin/.next/static \
  && if [ -d public ]; then cp -R public .next/standalone/apps/admin/public; fi

FROM docker.io/library/node:22-bookworm-slim AS prod
WORKDIR /app/apps/admin
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001
COPY --from=builder --chown=node:node /app/apps/admin/.next/standalone /app
USER node
EXPOSE 3001
CMD ["node", "server.js"]
