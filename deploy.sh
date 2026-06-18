#!/bin/bash
# 小易智能体超市 - 从 GitHub 同步网站到服务器
# 用法: ./deploy.sh  (手动同步，由用户触发执行)

set -e

echo "========================================"
echo "🚀 小易智能体超市 - 同步网站到服务器"
echo "========================================"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"

REPO_DIR="/home/projects/claw_market"
NGINX_DIR="/home/nginx/html/agency-agents"

echo ""
echo "1️⃣  从 GitHub 拉取最新代码..."
cd "$REPO_DIR"
git pull origin master 2>&1 || {
    echo "⚠️  git pull 失败，跳过本次同步"
    exit 1
}
echo "✅ 代码拉取完成"
echo ""

echo "2️⃣  备份旧文件..."
BACKUP_DIR="$REPO_DIR/backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$NGINX_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ 备份完成: $BACKUP_DIR"
echo ""

echo "3️⃣  复制文件到 Nginx 目录..."
cp -r "$REPO_DIR"/* "$NGINX_DIR/"
echo "✅ 文件复制完成"
echo ""

echo "4️⃣  重启 Nginx..."
docker restart nginx
sleep 3
echo "✅ Nginx 重启完成"

echo ""
echo "========================================"
echo "✅ 同步完成！"
echo "========================================"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "网站: https://www.hyesky.com"
