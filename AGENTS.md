# AGENTS.md

Full-stack church management app. `frontend/` = React 19 + Vite SPA; `backend/` = Django 6 + DRF API; `docs/` = standalone Astro docs site (own package.json — ignore for app work). No CI, no pre-commit hooks, no linters wired to git.

## Commands

- Frontend (port **5174**): `cd frontend && npm run dev`, `npm run build`, `npm run lint`. There is **no test script** — only `dev/build/lint/preview`. (CONTRIBUTING.md's `npm run test` is stale.)
- Backend (port 8000): `cd backend && source .venv/bin/activate && python manage.py runserver`. Tests: `python manage.py test` (suites in `userapp/tests.py`, `communication/tests.py`, `mainapp/tests/`).
- Docker (created fresh, use instead of manual setup): `make dev` = dev stack w/ hot reload (backend autoreloads via `runserver`, frontend via Vite HMR, Postgres included). `make prod` serves the nginx build on `:8080` with `/api` proxied to backend. Ports: dev `5174`/`8000`. `make migrate`, `make shell`, `make logs`.
- Docs site: `cd docs && npm run dev` (Astro).

## Env / startup gotchas

- `backend/.env`, `frontend/.env`, `backend/firebase-key.json` are all gitignored; copy per README §Getting Started. Backend will not import without `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` and `PAYSTACK_SECRET_KEY` (settings calls `config()` with no defaults). Missing `firebase-key.json` only warns at startup but `FirebaseAuthentication` fails per-request.
- README claims SQLite fallback when `DATABASE_URL` is unset — **stale**. `church/settings.py` always uses `dj_database_url.config()`, falling back to Postgres built from `POSTGRES_*` env (default `myuser@localhost/mydatabase`); the SQLite block is commented out. Local dev requires a reachable Postgres (the docker stack provides one).
- Frontend `VITE_API_URL` fallbacks are inconsistent: most stores/`axiosInstance.js` default to the **production** backend (`opencms-q36g.onrender.com/api`), others to `localhost`. Always set `VITE_API_URL=http://localhost:8000/api` in `frontend/.env`, or requests silently hit prod.
- `frontend/src/firebase.js` **hardcodes** the Firebase config — the `VITE_FIREBASE_*` vars in `.env` are never read. Editing them does nothing.
- Backend CORS allowlist is hardcoded in `church/settings.py` (`localhost:5173/5174` + Vercel/Render keys); `CORS_ALLOW_ALL_ORIGINS=False`. The prod docker setup avoids CORS via same-origin nginx `/api` proxy, so no edit needed there.
- DRF default auth is the custom `FirebaseAuthentication` (`userapp/authentication.py`) backed by `userapp.CustomUser`; no session/basic auth on `/api/` by default.
- `requirements.txt` is fully pinned; `psycopg2` needs `libpq`/compiler to build. Django 6 → Python 3.12; Vite 7 → Node ≥ 20.19.

## Conventions

- Commits use `Type(Scope): Subject` (e.g. `Feat(SEO):`, `Fix(Dependencies):`, `Polish(UI):`, `Docs(API):`), no emojis. Long-lived branches: `main`, `develop`; feature branches like `nk/permission_splitting`.
- Backend: models + serializers + ViewSets per Django app, routed via `DefaultRouter` in each app's `urls.py`; `select_related`/`prefetch_related` on querysets; validate in serializers, not views.
- Frontend: global state in Zustand stores under `src/zustand/` (auth token via `useAuthStore.getState().token`); Tailwind 4 + DaisyUI; mutations return `{ success, error }`.
- Firestore chat rooms use id prefixes `fellowship_`, `leadership_`, `department_`, `course_`; listeners go in `useEffect` with cleanup.