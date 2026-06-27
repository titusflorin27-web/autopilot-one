#!/usr/bin/env sh
set -eu

COMPOSE_FILE="infrastructure/docker-compose.vps.example.yml"

sh scripts/vps-preflight.sh

git fetch origin main
git checkout main
git pull origin main

docker compose -f "$COMPOSE_FILE" up --build -d
docker compose -f "$COMPOSE_FILE" exec -T api pnpm db:migrate

echo "VPS deploy completed. Run scripts/vps-healthcheck.sh next."
