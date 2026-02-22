# React Microfrontend Portal

Internal banking operations portal built with React 18, TypeScript, and Webpack 5 Module Federation. Four independent apps (host + 3 microfrontends) composed at runtime through Module Federation.

## Quick Start

```bash
npm install
npm run build    # build shared-ui first, then all packages
npm run dev      # starts all apps concurrently
```

- Host App: http://localhost:3000
- Profile MF: http://localhost:3001
- Notifications MF: http://localhost:3002
- Reports MF: http://localhost:3003

## Login Credentials

| Email | Password | Role |
|-------|----------|------|
| janis.berzins@portals.lv | admin123 | Admin |
| liga.ozola@portals.lv | operator123 | Operator |
| maris.kalns@portals.lv | viewer123 | Viewer |

Roles control what you can do — Admin has full access, Operator can edit and view reports, Viewer is read-only.

## What's Inside

**Host App** — shell with auth, routing, layout, and a dashboard that aggregates data from other modules. Uses mock JWT auth with token refresh and role-based route guards.

**Profile MF** — user profile with inline editing and form validation.

**Notifications MF** — notification list with optimistic mark-as-read updates. Emits unread count events so the host can show a badge in the nav.

**Reports MF** — sortable/filterable/searchable table with server-side pagination, CSV export, delete with confirmation modal. Supports both REST and GraphQL query patterns.

**Shared UI** — 12 components (Button, Input, Card, Spinner, ErrorFallback, Badge, Skeleton, Modal, Toast, Tabs, Table, Pagination) plus design tokens and a typed event bus for cross-MF communication.

## Cross-MF Communication

Microfrontends talk to each other through a typed event bus built on `CustomEvent`. Works naturally with Module Federation since `window` is shared. Notifications MF emits events, host app and dashboard listen.

## Testing

```bash
npm run test       # unit + component tests
npm run test:e2e   # end-to-end tests
npm run lint
```

CI pipeline runs lint → tests (parallel per workspace) → build → E2E via GitHub Actions.

## Tech Stack

- React 18 + TypeScript (strict)
- Webpack 5 Module Federation
- React Router 6
- Jest + React Testing Library
- Playwright
- GitHub Actions CI/CD
- npm workspaces monorepo

## License

MIT
