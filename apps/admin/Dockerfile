FROM oven/bun:1 AS dev
WORKDIR /app
CMD ["sh", "-lc", "bun install --frozen-lockfile && bun run dev"]

FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build && mkdir -p .next/standalone/.next && cp -R .next/static .next/standalone/.next/static && if [ -d public ]; then cp -R public .next/standalone/public; fi

FROM node:22-bookworm-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3001
COPY --from=builder --chown=node:node /app/.next/standalone ./
USER node
EXPOSE 3001
CMD ["node", "server.js"]
