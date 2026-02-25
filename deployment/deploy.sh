#!/usr/bin/env bash
# HySP Admin UI - Deployment Script (Podman)
# Usage: sudo bash /hysp/hyadmin-ui/deployment/deploy.sh
#
# Build-time env vars (NEXT_PUBLIC_*) are baked into the image.
# Edit the variables below before building if the values have changed.

set -euo pipefail

APP_DIR="/hysp/hyadmin-ui"
IMAGE="localhost/hyadmin-ui:latest"
QUADLET_SRC="$APP_DIR/deployment/hyadmin-ui.container"
QUADLET_DEST="/etc/containers/systemd/hyadmin-ui.container"
NGINX_SRC="$APP_DIR/deployment/nginx-hyadmin-ui.conf"
NGINX_DEST="/etc/nginx/conf.d/service/hyadmin-ui.conf"

# ── Build-time settings (edit as needed) ─────────────────────────────────────
NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://127.0.0.1:8080}"
NEXT_PUBLIC_TENANT_ID="${NEXT_PUBLIC_TENANT_ID:-default}"
# ─────────────────────────────────────────────────────────────────────────────

echo "=== [1/5] Pull latest code ==="
cd "$APP_DIR"
git pull

echo "=== [2/5] Build container image ==="
echo "  NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
echo "  NEXT_PUBLIC_TENANT_ID=$NEXT_PUBLIC_TENANT_ID"
podman build \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    --build-arg NEXT_PUBLIC_TENANT_ID="$NEXT_PUBLIC_TENANT_ID" \
    -t "$IMAGE" .

echo "=== [3/5] Install Quadlet file ==="
cp "$QUADLET_SRC" "$QUADLET_DEST"
systemctl daemon-reload

echo "=== [4/5] Enable & restart service ==="
systemctl enable hyadmin-ui
systemctl restart hyadmin-ui
systemctl status hyadmin-ui --no-pager

echo "=== [5/5] Install nginx config ==="
mkdir -p "$(dirname "$NGINX_DEST")"
cp "$NGINX_SRC" "$NGINX_DEST"
nginx -t && systemctl reload nginx

echo ""
echo "Done."
echo "  UI:    https://your-domain/hyadmin/"
echo "  Nginx: /hyadmin/ → port 3000"
