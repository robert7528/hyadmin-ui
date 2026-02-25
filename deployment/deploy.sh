#!/usr/bin/env bash
# HySP Admin UI - Deployment Script
# Usage: sudo bash /hysp/hyadmin-ui/deployment/deploy.sh

set -euo pipefail

APP_DIR="/hysp/hyadmin-ui"
SERVICE="hyadmin-ui"

echo "=== [1/6] Pull latest code ==="
cd "$APP_DIR"
git pull

echo "=== [2/6] Ensure Bun is installed ==="
if ! command -v bun &>/dev/null; then
    echo "Bun not found, installing..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi
bun --version

echo "=== [3/6] Install dependencies ==="
bun install --frozen-lockfile

echo "=== [4/6] Build ==="
bun run build

echo "=== [5/6] Copy static assets to standalone output ==="
# Next.js standalone build requires these to be copied manually
cp -r "$APP_DIR/.next/static" "$APP_DIR/.next/standalone/.next/static"
if [ -d "$APP_DIR/public" ]; then
    cp -r "$APP_DIR/public" "$APP_DIR/.next/standalone/public"
fi

echo "=== [6/6] Install & restart systemd service ==="
cp "$APP_DIR/deployment/hyadmin-ui.service" /etc/systemd/system/hyadmin-ui.service
systemctl daemon-reload
systemctl enable hyadmin-ui
systemctl restart hyadmin-ui
systemctl status hyadmin-ui --no-pager

echo ""
echo "Done. Access at: https://your-domain/hyadmin/"
