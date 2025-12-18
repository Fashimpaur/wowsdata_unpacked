#!/usr/bin/env sh
set -e

echo "[start] Applying database migrations (alembic upgrade head)"
alembic upgrade head

echo "[start] Starting Uvicorn"
exec uvicorn src.app.main:app --host 0.0.0.0 --port 8000 --reload
