# Handshake AI

An interactive recreation of the Handshake AI contributor workspace, including assessment completion, AI work, and project browsing flows.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/handshake-ai/src/App.tsx` — route shell, local project data, and interactive page behavior
- `artifacts/handshake-ai/src/index.css` — visual tokens and workspace styling
- `artifacts/handshake-ai/public/handshake-logo.png` — uploaded Handshake brand mark used throughout the shell
- `.local/conversation-workspace/files/clone-data/` — captured reference HTML, data, and screenshots used during the clone

## Architecture decisions

- The clone is frontend-only because the reference experience is a local workspace prototype; interactions use local React state and URL navigation.
- Shared navigation and header structure wrap all three reference routes so route changes preserve the workspace chrome.
- Project browser filters and dashboard actions derive from one local project dataset so counts and detail dialogs stay consistent.

## Product

- Assessment completion route with links into AI work and projects.
- AI work dashboard with current/past project tabs, FAQ accordions, checklist actions, and referral actions.
- Project browser with search, status filters, sorting, project details, and start/continue flows.
- Routed workspace views for Jobs, Explore, Inbox, Feed, AI showcase, Events, Employers, Payments, Referrals, Support, and Account settings.
- A stateful task workspace that persists started projects and walks contributors through three task steps.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
