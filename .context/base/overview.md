# Overview

`naufalrf-portfolio` is a repository shell for five standalone applications that together form a portfolio ecosystem: a public portfolio site, an admin dashboard and API authority, a links page, an anonymous message app, and a FastAPI RAG service.

The current repository is unfinished. The immediate goal is not to invent a new product direction, but to finish this multi-app ecosystem with durable architecture rules, stronger security defaults, and page/component/design parity with the legacy reference at `../naufalrf-portfolio-phase2`.

Primary user:

- NaufalRF as the owner/operator who maintains content, public presence, and AI-assisted portfolio exploration through multiple connected apps.

Core value:

- Present portfolio content, contact channels, and AI-assisted exploration through separate apps that share one centralized Neon/Postgres database and clear API boundaries.

Explicit non-goals:

- This root is not a unified app runtime or package workspace.
- Future agents should not invent shared root install, build, or test commands that the repo does not define.
- Initialization work should not rewrite application behavior unless a repo truth contradiction must be corrected.
