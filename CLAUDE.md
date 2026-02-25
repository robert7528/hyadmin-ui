# hyadmin-ui

## Development Environment

- **Windows local**: Source code editing only.
- **GitHub**: `hysp/hyadmin-ui`
- **Package manager**: Bun

## Project Structure

Next.js Admin Shell for HySP Admin Platform.

- Framework: Next.js 15 App Router
- UI: HeroUI (layout shell) + Shadcn/ui (components) + Tailwind CSS
- Micro-frontend: micro-app (@micro-zoe/micro-app)

## Key Patterns

- `src/app/layout.tsx` — Root shell: Header + Sidebar + Footer
- `src/components/providers.tsx` — HeroUI provider ('use client')
- `src/components/layout/sidebar.tsx` — Fetches modules from hyadmin-api, renders nav links
- `src/app/app/[...route]/page.tsx` — Dynamic route for micro-frontend modules
- `src/components/micro-app/app-container.tsx` — Renders `<micro-app>` custom element
- `src/lib/micro-app.ts` — `fetchModules()` calls `GET /api/v1/modules`

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_TENANT_ID=default
```

Copy `.env.local.example` to `.env.local` for local dev.

## On Linux server

```bash
cd /hysp/hyadmin-ui
git pull
bun install
bun run build
sudo systemctl restart hyadmin-ui
```
