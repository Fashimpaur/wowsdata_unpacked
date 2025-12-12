# Session Log — 2025-12-11

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
