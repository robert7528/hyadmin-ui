# hyadmin-ui

## Development Environment

- **Windows local**: Source code editing only. No Node/Bun runtime available.
- **GitHub**: `robert7528/hyadmin-ui`
- **Package manager**: Bun
- **Deploy**: Linux server (`/hysp/hyadmin-ui/`) via Podman Quadlet + systemctl.

## Project Structure

```
hyadmin-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root shell: Providers + ShellWrapper
│   │   ├── page.tsx                # Dashboard 首頁
│   │   ├── globals.css             # Tailwind + CSS variables (Shadcn/ui theme)
│   │   ├── login/page.tsx          # 登入頁
│   │   ├── (shell)/                # Shell route group（admin pages + profile）
│   │   │   ├── admin/              # 系統管理 CRUD 頁面
│   │   │   └── profile/page.tsx    # 個人設定
│   │   └── app/[...route]/page.tsx # micro-app 動態路由（client component）
│   ├── components/
│   │   ├── providers.tsx           # PermissionProvider + ModuleProvider
│   │   ├── permission-guard.tsx    # 權限控制元件
│   │   ├── layout/
│   │   │   ├── header.tsx          # Top bar（module tabs + user menu）
│   │   │   ├── sidebar.tsx         # 左側選單（模組功能 / admin 選單）
│   │   │   ├── breadcrumb.tsx      # 麵包屑導航
│   │   │   ├── shell-wrapper.tsx   # Header + Sidebar + main 整合
│   │   │   └── footer.tsx
│   │   ├── cert/
│   │   │   ├── cert-router.tsx     # 憑證模組路由（toolbox / list）
│   │   │   ├── toolbox.tsx         # 憑證工具箱（verify / parse / convert / CSR）
│   │   │   └── cert-list.tsx       # 憑證列表（P2 placeholder）
│   │   ├── micro-app/
│   │   │   └── app-container.tsx   # <micro-app> 自訂元素容器
│   │   └── ui/                     # Shadcn/ui 組件
│   ├── contexts/
│   │   ├── module-context.tsx      # 模組 + 功能選擇狀態
│   │   └── permission-context.tsx  # 使用者權限快取
│   ├── hooks/
│   │   └── use-idle-timeout.ts     # 閒置自動登出
│   ├── lib/
│   │   ├── api.ts                  # apiFetch + 各資源 API client
│   │   ├── cert-api.ts             # hycert-api client（utility endpoints）
│   │   ├── utils.ts                # cn() helper（clsx + tailwind-merge）
│   │   └── micro-app.ts            # fetchModules() + initMicroApp()
│   └── types/                      # TypeScript interfaces
├── deployment/
│   ├── hyadmin-ui.container        # Podman Quadlet
│   ├── nginx-hyadmin-ui.conf       # nginx location config
│   └── deploy.sh                   # 完整部署腳本
├── next.config.ts                  # basePath: '/hyadmin', output: 'standalone'
├── tailwind.config.ts              # Shadcn/ui theme + tailwindcss-animate
├── components.json                 # Shadcn/ui config
├── .env.local.example
└── Containerfile                   # Bun build + Node runner
```

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Shadcn/ui（Radix UI primitives）+ Tailwind CSS
- micro-app（`@micro-zoe/micro-app`）微前端子應用載入
- Bun（package manager + build）

## Key Patterns

### basePath
- `next.config.ts` 設定 `basePath: '/hyadmin'`
- 所有內部路由、`_next/static` 自動加前綴
- nginx **不剝離**前綴（`proxy_pass http://127.0.0.1:3000`，無 trailing slash）

### 環境變數（Build-time）
- `NEXT_PUBLIC_*` 在 **build time 嵌入**，不能 runtime 注入
- 需透過 `--build-arg` 傳入 Containerfile：
  ```bash
  export NEXT_PUBLIC_API_URL=https://your-domain/hyadmin-api
  sudo bash deployment/deploy.sh
  ```

### Layout 架構
- **Header**: Logo + 模組水平 tabs（responsive overflow dropdown）+ 系統管理 tab + 使用者選單
- **Sidebar**: 依選中模組顯示功能列表；admin 路由顯示管理選單
- **Breadcrumb**: 首頁 → 模組 → 功能（或管理路徑標籤）
- **Mobile**: Sidebar 以 Sheet 呈現，Header 左側漢堡按鈕觸發

### 模組動態載入流程
1. Header `loadModules()` → `GET /api/v1/modules`（帶 `X-Tenant-ID`）
2. 點選模組 tab → `selectModule()` → 載入功能列表 → Sidebar 顯示
3. 點選功能 → `/app/{route}/{path}` → `AppContainer` → `microApp.start()`

### 新增 Shadcn/ui 組件
```bash
bunx shadcn@latest add button
```

## Environment Variables

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | hyadmin-api base URL（build-time） |
| `NEXT_PUBLIC_CERT_API_URL` | `http://localhost:8082` | hycert-api base URL（build-time） |
| `NEXT_PUBLIC_TENANT_ID` | `default` | Tenant ID for API requests（build-time） |

本地開發：複製 `.env.local.example` → `.env.local`

## nginx

- 路徑：`/hyadmin/` → `http://127.0.0.1:3000`
- **無 trailing slash**：Next.js basePath 需收到完整路徑（含 `/hyadmin/`）

## Deploy

```bash
# 第一次
git clone https://github.com/robert7528/hyadmin-ui.git /hysp/hyadmin-ui

# 部署（API URL 若有變更先 export）
export NEXT_PUBLIC_API_URL=https://your-domain/hyadmin-api
sudo bash /hysp/hyadmin-ui/deployment/deploy.sh
# 步驟：git pull → podman build（含 build-arg）
#        → Quadlet 安裝 → systemctl restart → nginx reload
```
