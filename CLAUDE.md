# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Django REST + Angular app for collecting job offers, importing job postings from a URL, running LLM-based analysis (skills/seniority/domain/red flags), and matching offers against a candidate profile. Backend and frontend are separate deployables in one repo:

- `apps/` + `config/` — Django 6 / DRF API (Python 3.14+)
- `frontend/` — Angular 21 SPA (zoneless, signal-based state)

## Commands

### Backend (run from repo root)

```bash
python3.14 -m venv career-aapi_venv
source career-aapi_venv/bin/activate   # Windows: career-aapi_venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Before delivering a backend change:

```bash
python manage.py check
python manage.py test
```

Run a single app's tests or a single test case:

```bash
python manage.py test apps.jobs
python manage.py test apps.jobs.tests.JobOfferTests.test_import_url
```

After changing any model, generate a migration (never hand-edit an already-committed migration):

```bash
python manage.py makemigrations
```

### Frontend (run from `frontend/`)

```bash
npm install
npm run start   # ng serve, http://localhost:4200
npm run build   # ng build
npm run watch   # ng build --watch --configuration development
npm run test    # Vitest
```

Before delivering a frontend change, at minimum run `npm run build`.

## Architecture

### Backend apps (`apps/`)

- `apps/jobs` — `JobOffer` / `JobMatch` models, the `JobOfferViewSet` (CRUD + `import-url`, `analyze`, `match`, `generate-cover-letter`, `generate-interview-prep` actions), and `services/job_importer.py` + `services/importers/` (source detection → HTML fetch → per-site parser: `linkedin_parser`, `hellowork_parser`, `generic_parser`).
- `apps/ai` — `LLMClient` (thin OpenAI SDK wrapper, model/key from `OPENAI_API_KEY`/`OPENAI_MODEL` settings), `job_analyzer` (prompts the model for JSON skills/seniority/summary/red-flags and writes it onto a `JobOffer`), `matcher` (scores a `JobOffer` against the requesting user's `Candidate` profile by skill-set intersection), and `content_generator` (cover letters / interview prep). LLM prompts currently instruct the model to reply in French with a strict JSON contract — `parsers.py` is responsible for coercing that response into a dict.
- `apps/profiles` — `Candidate` model (one-to-one with `User`): skills, seniority, target locations/salary, links.
- `apps/applications` — `Application` model tracking status (`SAVED`/`APPLIED`/`INTERVIEWED`/`REJECTED`/`OFFER`) per `JobOffer`. An `Application` row is created automatically whenever a `JobOffer` is created (both in `JobOfferViewSet.perform_create` and in `import_job_from_url`) — keep these two creation paths in sync if that invariant changes.
- `apps/accounts` — auth endpoints (`/api/auth/login`, `/register`, `/logout`, `/me`, `/csrf`). Auth is cookie-based, not the DRF-standard `Authorization` header flow: `CookieTokenAuthentication` (`apps/accounts/authentication.py`) reads a DRF token out of an httpOnly cookie and enforces CSRF on unsafe methods, matching `SessionAuthentication` semantics. Header-based `TokenAuthentication` is kept as a fallback for non-browser clients. `REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES` in `config/settings.py` tries cookie auth first.
- `apps/core` — shared pieces; notably `CountlessPaginator`/`CountlessPage` in `paginators.py`, a paginator that only reports has-next/has-previous (no total count) by over-fetching one extra row per page. `JobOfferViewSet.list` uses it directly instead of DRF's standard pagination classes.

Every per-user resource is scoped with `.filter(user=request.user)` (or via the user's `candidate`/`job_offer`) — new endpoints over user-owned data must follow the same pattern; there is no other authorization layer.

Root URLs (`config/urls.py`) mount each app under `/api/<name>/`: `ai`, `profile`, `jobs`, `applications`, `auth`, plus `/admin/`.

CSRF/cookie behavior is environment-sensitive: `CROSS_SITE_COOKIES` (env `CROSS_SITE_COOKIES`, defaults to `not DEBUG`) switches cookie `SameSite`/`Secure` between local dev (same-origin, `Lax`) and production (cross-site SPA on GitHub Pages calling a separate API host, `None; Secure`). The SPA fetches a CSRF token from `/api/auth/csrf/` and echoes it via `X-CSRFToken` because it can't read a cookie set on the API's domain cross-site.

### Frontend (`frontend/src/app/`)

Angular 21, zoneless change detection (`provideZonelessChangeDetection`), standalone components, lazy-loaded feature routes. Path aliases: `@app/*`, `@assets/*`, `@environments/*` (see `tsconfig.json`).

- `core/api/*.api.ts` — one thin class per backend resource (`AuthApi`, `JobsApi`, `ApplicationsApi`, `ProfileApi`), all built on `core/api/api.service.ts` (`ApiService`), which just prefixes `API_CONFIG_TOKEN.baseApiUrl` and delegates to `HttpClient`.
- `core/state/*.store.ts` — one signal-based store per domain (`AuthStore`, `JobsStore`, `ApplicationStore`, `ProfileStore`), `providedIn: 'root'`. Stores hold private writable signals and expose `.asReadonly()` + `computed()`; components/services must not re-provide a store at a lower level (would fork shared state, e.g. login state). This is the state-management pattern in this codebase — there is no NgRx/Signal Store library.
- `core/auth/` — `authGuard` (redirects to `/auth/login` unless `AuthStore.isLoggedIn()`), `authInterceptor`, `CsrfService`.
- `core/interceptors/` — `loadingInterceptor` (tracks in-flight request count for a global spinner) and `errorInterceptor` (normalizes HTTP errors, see `core/models/api-error.model.ts` and `core/services/error.service.ts`).
- App bootstrap (`app.config.ts`) uses `provideAppInitializer` to fetch a CSRF token and hydrate the auth session from the session cookie *before* the app renders, so route guards see correct auth state on first paint — don't bypass this when adding routes that require auth.
- `features/<name>/` — one folder per route area (`auth`, `jobs`, `applications`, `profile`, `dashboard`), each with its own routes file where the feature has multiple pages (e.g. `features/jobs/jobs.routes.ts`). `features/jobs` has `jobs-list`/`jobs-detail`/`jobs-create`; `features/applications` has kanban/card components plus cover-letter/interview-prep dialogs, backed by AI generation endpoints on `JobOfferViewSet`.
- `shared/` — cross-feature UI (`shared/ui/score-badge`, `shared/ui/empty-state`) and shared model types.

## Conventions

- Keep backend/frontend concerns separated: API/models/serializers/permissions/routes live in `apps/*` and `config/`; UI/routes/signals/helpers/assets live in `frontend/src/`.
- Every model change needs a migration; never edit an already-committed migration.
- API endpoints stay under the `/api/` prefix.
- Don't commit secrets, tokens, DB dumps, `.env`, `db.sqlite3`, `media/`, `staticfiles/`, `node_modules/`, or build output.
- Python: keep imports plain (no `try/except` import guards); validate API input with DRF serializers; scope user-owned lookups with `get_object_or_404(..., user=request.user)` or an equivalent filter.
- Frontend: follow the existing Angular/standalone-component style; use the `@app/` alias for cross-directory imports where existing code already does.
- PR summaries should state what changed, the main files/areas touched, which checks/tests were run, and any known limitations (e.g. a check that couldn't run due to environment constraints).
