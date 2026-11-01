# syntax=docker/dockerfile:1.7
FROM docker.io/oven/bun:1.3.14 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM docker.io/oven/bun:1.3.14 AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/public-astro/package.json ./apps/public-astro/package.json
COPY apps/links-astro/package.json ./apps/links-astro/package.json
COPY apps/ngl-svelte/package.json ./apps/ngl-svelte/package.json
COPY apps/rag-service/package.json ./apps/rag-service/package.json
COPY apps/live-presence/package.json ./apps/live-presence/package.json
COPY e2e/package.json ./e2e/package.json
RUN --mount=type=cache,id=bun-install-cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Migrations need Admin's source, Drizzle CLI, and workspace dependencies, but
# they do not need to compile the Next.js application. Keeping this target
# ahead of the production builder avoids repeating the memory-heavy Next build
# just to update the database schema.
FROM deps AS migrator
COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin
CMD ["bun", "run", "db:migrate"]

FROM docker.io/library/node:22-bookworm-slim AS builder
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
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/bun.lock ./bun.lock
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin
# Admin's build uses `next build --debug-prerender`, a required workaround
# for an unpatched Next.js 16 bug where prerendering the internal
# /_global-error page crashes (vercel/next.js#95741, #86178, #84994) —
# --debug-prerender lets the build actually complete instead of aborting.
# Run the Next CLI under Node so NODE_OPTIONS actually bounds the build heap;
# invoking it via `bun run` keeps Bun's much larger heap outside that limit.
RUN --mount=type=cache,id=admin-next-cache,target=/app/apps/admin/.next/cache \
  NODE_OPTIONS=--max-old-space-size=2048 node /app/node_modules/next/dist/bin/next build --debug-prerender \
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
