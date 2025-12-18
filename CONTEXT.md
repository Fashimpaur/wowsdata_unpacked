# Session Log — 2025-12-11

## Docker: Postgres + API setup (2025-12-16)

What’s configured now

- Postgres runs as a service via Docker Compose with a healthcheck and a named volume `pg_data` for persistence.
- API container (FastAPI) builds from `apps/api/Dockerfile` and starts via `./start.sh`.
- On API startup, Alembic runs `upgrade head` automatically, then Uvicorn launches.
- `db-init/` folder: any `.sql` here runs only on the very first Postgres initialization.
- Alembic is configured to read `DATABASE_URL` from environment (`apps/api/alembic.ini`).

Key files

- apps/api/docker-compose.yml
- apps/api/Dockerfile
- apps/api/start.sh
- apps/api/alembic.ini, apps/api/alembic/env.py, apps/api/alembic/versions/
- apps/api/db-init/init.sql

How to build and run (after reboot)

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\api"
docker compose up -d --build

# Status and logs
docker compose ps
docker logs -f api_postgres  # first run shows init scripts
docker logs -f fastapi_app   # shows Alembic then Uvicorn
```

Open the API: http://localhost:8000/docs

Run from project root instead of apps/api

```
docker compose -f apps/api/docker-compose.yml up -d --build
```

Rebuild tips

- Rebuild API only (no cache):
  ```
  docker compose build --no-cache api
  docker compose up -d api
  ```
- Reset everything (removes DB volume/data):
  ```
  docker compose down -v
  docker compose up -d --build
  ```

Troubleshooting: 500 on Docker API (Windows)

- Symptom during `docker compose up -d --build`:
  `unable to get image 'api-api': request returned 500 Internal Server Error for API route ... /v1.51/...`
- Cause: Docker engine (Docker Desktop backend) isn’t running or context is broken.
- Fix:
    1) Quit Docker Desktop → `wsl --shutdown` → start Docker Desktop again → wait for “Engine running”.
    2) Verify:
       ```
       docker version   # should show Client AND Server
       docker info
       docker context ls
       ```
       Switch if needed: `docker context use default` (or `desktop-linux`).
    3) Clear env overrides (if any):
       ```
       $env:DOCKER_HOST=$null
       $env:DOCKER_API_VERSION=$null
       ```
    4) Retry build/run from `apps\api`.

Notes

- Database URL inside Compose is built from `.env` values but uses host `db` for container networking.
- To autogenerate migrations later, set `target_metadata` in `apps/api/alembic/env.py` to your models’ metadata.

## Summary

- Backend: FastAPI scaffold ready; health endpoint at `/api/v1/health`.
- Frontend: Vite/React scaffold ready; unit and e2e tests configured.
- Docs updated to use pyenv + pipenv for local API development.

### Progress today (2025-12-11)

- Clarified why router file is named `v1.py` (API versioning under `/api/v1`).
- Guided installation of Node.js/npm on Windows (Node installer/winget/choco/nvm-windows).
- Fixed npm ENOENT by running commands from `apps/web` (frontend subfolder) instead of repo root.
- Addressed `'vite' is not recognized` by ensuring devDependencies install and using `npm install --include=dev` (or
  `npx vite`).
- Recommended setting PowerShell (or PowerShell 7) as default shell in IDE/terminal to avoid shell reminders.

## What’s done

- Verified API router wiring and settings env pattern.
- Docker Compose configured for Postgres + API.
- README updated with pyenv/pipenv steps, Docker, frontend, and test instructions.

## Commands used / How to run

### API (local, pyenv + pipenv)

```
cd "F:\WOWS Game Data\wowsdata_unpacked"
pyenv install 3.12.3    # if needed
pyenv local 3.12.3
python --version

pipenv --rm              # optional
pipenv install -r apps/api/requirements.txt
```

### API tests

```
# From repo root
pipenv run python -m unittest discover -s apps/api/tests -p "test_*.py"

# Or from apps\api
cd apps\api
pipenv run python -m unittest discover -s tests -p "test_*.py"
```

### API (Docker Compose)

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\api"
copy .env.example .env   # edit as needed
docker compose up --build
```

### Web (Vite + React)

```
cd "F:\WOWS Game Data\wowsdata_unpacked\apps\web"
npm install
npm run dev
```

### Web tests

```
npm test
npx playwright install
npm run test:e2e
```

## Troubleshooting notes (Windows)

- If `npm` isn’t recognized, install Node.js LTS (npm is bundled) and restart terminal.
- If `npm install` errors with ENOENT for `package.json`, ensure you’re in `apps/web`.
- If `'vite' is not recognized` when running `npm run dev`:
    - Reinstall with dev deps: `npm install --include=dev`
    - Ensure `npm config get production` is `false`, else `npm config set production false` and reinstall.
    - Verify: `Test-Path .\node_modules\.bin\vite.cmd` (should be True on Windows) or run `npx vite`.
    - Node 18+ recommended: check `node -v`, `npm -v`.

## Shell configuration (optional but recommended)

- JetBrains → Settings → Tools → Terminal → Shell path → set to PowerShell (`powershell.exe`) or PowerShell 7 (
  `pwsh.exe`).
- Windows Terminal → Settings → set default profile to PowerShell.
- To run local scripts, you may set: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

## Next steps

- Frontend ✓/*:
    - From `apps/web`: `npm install --include=dev`; then `npm run dev` to verify the dev server. *
    - Run unit tests: `npm test`; run e2e: `npx playwright install` then `npm run test:e2e`.
- Backend:
    - From repo root: `pipenv run python -m unittest discover -s apps/api/tests -p "test_*.py"` to confirm
      `/api/v1/health`.
- Pick next work item:
    - A) Database foundation: SQLAlchemy models, session, initial Alembic migration.
    - B) First feature: `GET /api/v1/ships` with stub data + React page consuming it.
    - C) Dev ergonomics: add PowerShell helper scripts for common tasks.

# Session Log — 2025-12-17

## Progress today

- Performed a clean-slate Docker build to measure cold build time with `.dockerignore` in place.
- Brought up services via Compose; verified that Postgres pulls and starts.
- Resolved connectivity issue from pgAdmin 4: connection timeouts were due to using the wrong host port (8432). The
  database is published on `5432` per `docker-compose.yml`.
- Confirmed successful connection from desktop pgAdmin to the containerized Postgres using:
    - Host: `localhost`
    - Port: `5432`
    - User: from `.env` (`DB_USER`, default `postgres`)
    - Password: from `.env` (`DB_PASSWORD`, default `postgres`)
    - Database: from `.env` (`DB_NAME`, default `appdb`)

## Useful commands and notes

- Bring up services (from `apps/api`):
  ```
  docker compose up -d --build
  docker ps  # verify api_postgres is Up (healthy)
  ```
- Test DB connection from desktop (PowerShell with defaults):
  ```
  psql "postgresql://postgres:postgres@localhost:5432/appdb" -c "SELECT now();"
  ```
- If you prefer a different host port (e.g., 8432), change mapping under `db` in `apps/api/docker-compose.yml`:
  ```
  ports:
    - "8432:5432"
  ```
  Then run `docker compose up -d` and connect to port 8432 in pgAdmin.

## Stopping point

- Postgres container is healthy and reachable from the desktop via the correct port (5432).
- Next session options:
    1) Set up SQLAlchemy models and Alembic `target_metadata` (Database foundation).
    2) Implement stub endpoint `GET /api/v1/ships` and wire a simple React consumer page.
    3) Add helper PowerShell scripts (compose up/down, logs, test, etc.) for convenience.

