# wowsdata_unpacked

FastAPI + Vite/React starter workspace for exploring World of Warships data.

This repository contains:

- Backend API (FastAPI) in `apps/api`
- Frontend web app (Vite + React) in `apps/web`

The local Python toolchain uses `pyenv` to pin Python and `pipenv` to manage the virtualenv for development.

## Prerequisites

- Python 3.12 (managed via pyenv/pyenv-win)
- pipenv
- Node.js 18+ and npm (or pnpm)
- Optional: Docker Desktop (for Postgres + API via docker-compose)

## Backend (FastAPI) — Local dev with pyenv + pipenv

1) Select Python version with pyenv (project root):

```
cd "F:\WOWS Game Data\wowsdata_unpacked"
pyenv install 3.12.3    # skip if already installed
pyenv local 3.12.3
python --version         # should print 3.12.3
```

2) Create/update pipenv environment and install API requirements:

```
# still at repo root
pipenv --rm        # optional: reset env
pipenv install -r apps/api/requirements.txt
```

3) Run the API (either from the repo root or the API folder):

```
# From repo root
pipenv run uvicorn apps.api.src.app.main:app --reload --port 8000

# Or from apps\api
cd apps\api
pipenv run uvicorn src.app.main:app --reload --port 8000
```

- Base URL: http://localhost:8000
- Health check: http://localhost:8000/api/v1/health

4) Run API unit tests:

```
# From repo root
pipenv run python -m unittest discover -s apps/api/tests -p "test_*.py"

# Or from apps\api
cd apps\api
pipenv run python -m unittest discover -s tests -p "test_*.py"
```

## Backend (FastAPI) — Docker Compose

1) Ensure `apps/api/.env` exists (copy from `apps/api/.env.example` and adjust if needed).

2) Build and run:

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\api"
docker compose up --build
```

Services:

- Postgres 16 on `localhost:5432`
- FastAPI on `http://localhost:8000`

## Database & Alembic

The `Settings` class (`apps/api/src/config/settings.py`) builds `database_url` from environment variables in `.env`.

Once models are added you can run migrations:

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\api"
pipenv run alembic upgrade head
```

## Frontend (Vite + React)

Install and run dev server:

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\web"
npm install
npm run dev
```

Open the printed Local URL (usually http://localhost:5173).

Frontend unit tests (Vitest):

```
npm test
```

E2E tests (Playwright):

```
npx playwright install
npm run test:e2e         # headless
npm run test:e2e:ui      # with UI
```

If your dev server runs on a non-default port, adjust the base URL in `apps/web/playwright.config.ts`.

## Environment variables

See `apps/api/.env.example` for API settings:

- `APP_NAME`, `APP_ENV`, `APP_PORT`
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- OAuth placeholders

## Project status (as of 2025-12-11)

- API: Health endpoint OK; Docker Compose ready; DB models/migrations to be added.
- Web: Vite scaffold OK; unit and e2e test scaffolds ready.

Next steps (suggested):

- Choose: run tests first (API + web) or start modeling DB + Alembic.
- Optionally add scripts to the root (e.g., PowerShell helpers) to streamline common tasks.