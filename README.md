# hyadmin-ui

HySP Admin Platform — Next.js frontend Admin Shell.

## Tech Stack

- Next.js 15 (App Router) + React 19
- HeroUI (layout shell) + Shadcn/ui (components)
- Tailwind CSS
- micro-app (micro-frontend, loads sub-applications)
- Bun (package manager)

## Quick Start

```bash
cp .env.local.example .env.local
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
layout.tsx           ← Shell: Header + Sidebar + Footer + HeroUI Provider
├── /                ← Dashboard (page.tsx)
└── /app/[route]     ← Micro-frontend container (app-container.tsx)
```

The Sidebar fetches registered modules from `hyadmin-api` (`GET /api/v1/modules`) and renders nav links dynamically. Clicking a module loads it via `<micro-app>` in the content area.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | hyadmin-api base URL |
| `NEXT_PUBLIC_TENANT_ID` | `default` | Tenant ID for API requests |

## Build

```bash
bun run build
bun start
```

## Add Shadcn/ui Components

```bash
bunx shadcn@latest add button
```
