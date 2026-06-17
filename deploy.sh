#!/bin/bash
# 小易智能体超市自动部署脚本
# 用法: ./deploy.sh  (手动同步) 或 cron job 自动执行

set -e

echo "========================================"
echo "🚀 小易智能体超市 - 自动部署开始"
echo "========================================"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"

# 仓库路径
REPO_DIR="/home/projects/claw_market"
NGINX_DIR="/home/nginx/html/agency-agents"
BACKUP_DIR="/home/projects/claw_market/backup-$(date +%Y%m%d-%H%M%S)"

echo ""
echo "1️⃣  拉取最新代码..."
cd "$REPO_DIR"
git pull origin master 2>&1 || {
    echo "⚠️  git pull 失败，跳过本次同步"
    exit 1
}

echo "✅ 代码拉取完成"
echo ""
echo "2️⃣  备份旧文件..."
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
echo "✅ 部署完成！"
echo "========================================"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
echo "网站: https://www.hyesky.com"
