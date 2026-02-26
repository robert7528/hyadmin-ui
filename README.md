# hyadmin-ui

HySP Admin Platform — Next.js frontend Admin Shell.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- HeroUI（layout shell）+ Shadcn/ui（components）+ Tailwind CSS
- micro-app（`@micro-zoe/micro-app`）微前端子應用載入
- Bun（package manager + build）
- Podman Quadlet + systemctl（部署）

## Quick Start（本地開發）

```bash
cp .env.local.example .env.local
# 編輯 .env.local 填入 hyadmin-api URL
bun install
bun dev
```

開啟 [http://localhost:3000/hyadmin](http://localhost:3000/hyadmin)（basePath = `/hyadmin`）。

## Architecture

```
layout.tsx                   ← Shell: HeroUI Provider + Header + Sidebar + Footer
├── /hyadmin/                ← Dashboard (page.tsx)
└── /hyadmin/app/[...route]  ← micro-app 動態路由 (app-container.tsx)
```

Sidebar 從 `GET /api/v1/modules` 動態取模組清單，點選後透過 `<micro-app>` 在 content area 載入子應用。

## Environment Variables

> `NEXT_PUBLIC_*` 為 **build-time** 變數，在編譯時嵌入，不能 runtime 注入。

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | hyadmin-api base URL |
| `NEXT_PUBLIC_TENANT_ID` | `default` | Tenant ID for API requests |

生產部署需透過 `--build-arg` 傳入：

```bash
export NEXT_PUBLIC_API_URL=https://your-domain/hyadmin-api
sudo bash deployment/deploy.sh
```

## Add Shadcn/ui Components

```bash
bunx shadcn@latest add button
```

## Build

```bash
bun run build
bun start
```

## Deploy

```bash
# 第一次
git clone https://github.com/robert7528/hyadmin-ui.git /hysp/hyadmin-ui

# 部署（API URL 若有變更先 export）
export NEXT_PUBLIC_API_URL=https://your-domain/hyadmin-api
sudo bash /hysp/hyadmin-ui/deployment/deploy.sh
```

`deploy.sh` 執行步驟：git pull → podman build（含 build-arg）→ Quadlet 安裝 → systemctl restart → nginx reload
