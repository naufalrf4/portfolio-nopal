# Overview

`naufalrf-portfolio` is a Bun workspace monorepo coordinating six applications that together form a portfolio ecosystem: a public portfolio site, an admin dashboard and API authority, a links page, an anonymous message app, a realtime cursor-presence service, and a TypeScript (Bun + Hono) RAG service.

The current repository is unfinished. The immediate goal is not to invent a new product direction, but to finish this multi-app ecosystem with durable architecture rules, stronger security defaults, and page/component/design parity with the legacy reference at `../naufalrf-portfolio-phase2`.

Primary user:

- NaufalRF as the owner/operator who maintains content, public presence, and AI-assisted portfolio exploration through multiple connected apps.

Core value:

- Present portfolio content, contact channels, AI-assisted exploration, and lightweight live presence through separate apps that share one centralized Neon/Postgres database policy and clear service boundaries.

Explicit non-goals:

- This root is a Bun workspace monorepo. Shared code lives in `packages/*`.
- A single `bun install` at the root installs all apps and shared packages. Do not invent missing root build or test commands.
- Initialization work should not rewrite application behavior unless a repo truth contradiction must be corrected.
