# Maintenance

## Ownership posture

- Treat the root as the coordination layer for repo truth, not as an app runtime.
- Treat each app directory as responsible for its own scripts, environment variables, and stack-specific conventions.

## Refresh triggers

Update the shared context and affected `AGENTS.md` files when any of the following changes:

- app commands or manifests
- architecture boundaries between Admin, RAG, and API-only apps
- security posture for auth, tokens, CORS, or direct database access
- legacy design baseline or visual system direction
- new recurring repo quirks that future agents would otherwise rediscover

## Dependency posture

- Read versions from manifests and lockfiles; do not hardcode or guess them in steering docs.
- Keep stack-specific guidance local to each app `AGENTS.md` when a rule does not apply repo-wide.

## Progress logging

- Append `PROGRESS.md` after initialization, refresh, repair, or any meaningful implementation milestone.
- Keep entries factual and chronological.
