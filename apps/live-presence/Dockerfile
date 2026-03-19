FROM oven/bun:1 AS dev
WORKDIR /app
COPY . .
CMD ["bun", "run", "dev"]

FROM oven/bun:1 AS prod
WORKDIR /app
COPY --chown=bun:bun . .
ENV NODE_ENV=production
ENV PORT=3006
USER bun
EXPOSE 3006
CMD ["bun", "run", "start"]
