# hyadmin-ui

HySP Admin Platform — Next.js frontend Admin Shell.

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Shadcn/ui（Radix UI primitives）+ Tailwind CSS
- micro-app（`@micro-zoe/micro-app`）微前端子應用載入
- Bun（package manager + build）
- Podman Quadlet + systemctl（部署）

## Quick Start（本地開發）

```bash
bun install
bun dev
```

開啟 [http://localhost:3000/hyadmin](http://localhost:3000/hyadmin)（basePath = `/hyadmin`）。

> 本地開發需透過 nginx 或 proxy 將 `/hyadmin-api` 代理到 hyadmin-api 服務。

## Architecture

```
layout.tsx                   ← Shell: Providers + Header + Sidebar + Footer
├── /hyadmin/                ← Dashboard (page.tsx)
└── /hyadmin/app/[...route]  ← micro-app / native module 動態路由
```

Sidebar 從 `GET /api/v1/modules` 動態取模組清單，點選後透過 `<micro-app>` 或 native page 在 content area 載入子應用。

## API URL

不使用 `NEXT_PUBLIC_*` 環境變數，一份 image 給所有客戶部署：

| API | 來源 | 預設值 |
|-----|------|--------|
| hyadmin-api | 硬編碼（`src/lib/api.ts`） | `/hyadmin-api` |
| 模組 API（如 hycert） | DB `hyadmin_modules.api_url` | `/hycert-api` |

瀏覽器 `fetch('/hyadmin-api/...')` 自動解析為當前域名。跨域部署時 `api_url` 填完整 URL。

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

# 部署（無需設環境變數，image 通用）
sudo bash /hysp/hyadmin-ui/deployment/deploy.sh
```

`deploy.sh` 執行步驟：git pull → podman pull image → Quadlet 安裝 → systemctl restart → nginx reload
