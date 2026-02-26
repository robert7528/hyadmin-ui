#!/usr/bin/env bash
# HySP Admin UI - Deployment Script (pull from ghcr.io)
# Usage: sudo bash /hysp/hyadmin-ui/deployment/deploy.sh
#
# NEXT_PUBLIC_* 變數在 CI 建立 image 時由 GitHub Variables 注入，
# 部署時只需 pull image，不需要在此設定。

set -euo pipefail

APP_DIR="/hysp/hyadmin-ui"
IMAGE="ghcr.io/robert7528/hyadmin-ui:latest"
QUADLET_SRC="$APP_DIR/deployment/hyadmin-ui.container"
QUADLET_DEST="/etc/containers/systemd/hyadmin-ui.container"
NGINX_SRC="$APP_DIR/deployment/nginx-hyadmin-ui.conf"
NGINX_DEST="/etc/nginx/conf.d/service/hyadmin-ui.conf"

echo "=== [1/3] Pull latest source (quadlet / nginx configs) ==="
cd "$APP_DIR"
git pull

echo "=== [2/3] Pull & start container ==="
# 若 GHCR package 為私有，需先執行：
#   podman login ghcr.io -u <github_username> -p <PAT>
podman pull "$IMAGE"

cp "$QUADLET_SRC" "$QUADLET_DEST"
systemctl daemon-reload
systemctl enable hyadmin-ui
systemctl restart hyadmin-ui
systemctl status hyadmin-ui --no-pager

echo "=== [3/3] Install nginx config ==="
mkdir -p "$(dirname "$NGINX_DEST")"
cp "$NGINX_SRC" "$NGINX_DEST"
nginx -t && systemctl reload nginx

echo ""
echo "Done."
echo "  UI:   https://your-domain/hyadmin/"
echo "  Log:  journalctl -u hyadmin-ui -f"
