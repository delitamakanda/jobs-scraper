# Jobs Scraper / Career Agent API [![Deploy Frontend](https://github.com/delitamakanda/jobs-scraper/actions/workflows/deploy-frontend.yml/badge.svg?branch=main&event=push)](https://github.com/delitamakanda/jobs-scraper/actions/workflows/deploy-frontend.yml)

Django REST API for collecting job offers, extracting job details from URLs, and matching offers against a candidate profile with AI-assisted analysis.

## What it does

- Stores job offers per authenticated user.
- Imports job pages from a URL and detects LinkedIn, HelloWork, or a generic source.
- Parses HTML with BeautifulSoup/lxml and saves normalized job metadata.
- Uses an OpenAI-compatible chat client to extract skills, seniority, domain summaries, and red flags.
- Computes profile/job matches from a candidate's stored skills.
- Tracks saved/applied/interview/rejection/offer application status in the data model.

## Tech stack

- Python 3.14+
- Django 6.0
- Django REST Framework
- SQLite for local development
- Requests, BeautifulSoup, and lxml for scraping/parsing
- OpenAI Python SDK configured for Tongyi/Qwen-compatible endpoints

## Project layout

```text
.
├── apps/
│   ├── accounts/       # Authentication app placeholder
│   ├── ai/             # LLM client, job analyzer, matching helpers, prompts
│   ├── applications/   # Application tracking model
│   ├── core/           # Shared/core app placeholder
│   ├── jobs/           # Job offer API, serializers, models, import services
│   └── profiles/       # Candidate profile model
├── config/             # Django settings and root URL configuration
├── manage.py
├── requirements.txt
├── requirements-dev.txt
└── pyproject.toml
```

## Prerequisites

- Python 3.14 or newer.
- A Tongyi/Qwen-compatible API key and base URL if you want to use job analysis or URL import, because imports call the analyzer after parsing.

## Quick start

1. Clone the repository and enter it:

   ```bash
   git clone <repo-url>
   cd jobs-scraper
   ```

2. Create and activate a virtual environment:

   ```bash
   python3.14 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables for AI-backed analysis:

   ```bash
   export TONGYI_API_KEY=your_api_key
   export TONGYI_API_URL=https://your-openai-compatible-endpoint/v1
   export TONGYI_MODEL=qwen-plus
   ```

   The settings module has development defaults for these values, but real analysis calls require valid credentials.

5. Run database migrations:

   ```bash
   python manage.py migrate
   ```

6. Create an admin user:

   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:

   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://127.0.0.1:8000/`.

## Authentication

The API uses Django REST Framework token authentication and requires authenticated requests by default.

Create or retrieve a token for a user from the Django shell:

```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

user = get_user_model().objects.get(username="<username>")
token, _ = Token.objects.get_or_create(user=user)
print(token.key)
```

Use the token in API requests:

```http
Authorization: Token <token>
```

## API endpoints

### Jobs

Base path: `/api/jobs/`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/jobs/` | List the authenticated user's job offers. |
| `POST` | `/api/jobs/` | Create a job offer manually. |
| `GET` | `/api/jobs/{id}/` | Retrieve a job offer. |
| `PUT/PATCH` | `/api/jobs/{id}/` | Update a job offer. |
| `DELETE` | `/api/jobs/{id}/` | Delete a job offer. |
| `POST` | `/api/jobs/import-url/` | Import, parse, analyze, and save a job offer from a URL. |
| `POST` | `/api/jobs/{id}/analyze/` | Re-run AI analysis for a saved job offer. |
| `POST` | `/api/jobs/{id}/match/` | Match a saved job offer against the authenticated user's candidate profile. |

Example: import a job URL

```bash
curl -X POST http://127.0.0.1:8000/api/jobs/import-url/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com/jobs/frontend-developer"}'
```

Example: create a job manually

```bash
curl -X POST http://127.0.0.1:8000/api/jobs/ \
  -H "Authorization: Token <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Angular Developer",
    "company": "Example Co",
    "url": "https://example.com/jobs/123",
    "raw_description": "We are looking for a senior Angular developer...",
    "location": "Remote"
  }'
```

### Other mounted API paths

These paths are registered in the root URL configuration, but their routers currently do not expose viewsets:

- `/api/auth/`
- `/api/ai/`
- `/api/profile/`
- `/api/applications/`

## Main data models

### JobOffer

Stores scraped or manually entered job data including source, title, company, URL, raw description, location, remote policy, contract type, skill lists, seniority, business domain, AI summary, and red flags.

### JobMatch

Stores a computed match score and generated guidance for a `JobOffer`.

### Candidate

Stores a user's candidate profile, skills, target locations, remote preference, industries, projects, and salary range.

### Application

Stores status and follow-up metadata for an application tied to a `JobOffer`.

## AI behavior

`apps.ai.services.llm_client.LLMClient` uses the OpenAI Python SDK with configurable `api_key`, `base_url`, and model. The analyzer prompts the model to return valid JSON with extracted skills, seniority, business domain, summary, and red flags, then persists those fields on the job offer.

## Development commands

Run Django checks:

```bash
python manage.py check
```

Run tests:

```bash
python manage.py test
```

Create migrations after model changes:

```bash
python manage.py makemigrations
```

Apply migrations:

```bash
python manage.py migrate
```

## Notes and current limitations

- The project is configured for local development with SQLite and `DEBUG = True`.
- Token authentication is enabled, but the accounts app does not currently expose login, registration, or token creation endpoints.
- URL import depends on the target site allowing HTML access. Some sites, including LinkedIn, may return limited content or block scraping.
- The import flow immediately runs AI analysis, so invalid AI credentials can cause URL import to fail after parsing.
- `requirements-dev.txt` is currently empty; add linting/type-checking/test tooling there as the development workflow grows.

## Architecture diagram

```mermaid
graph TB
    subgraph Frontend["Frontend (Angular 21)"]
        direction TB
        FE_Auth["Auth feature\n(login / register)"]
        FE_Jobs["Jobs feature\n(list / import / analyze)"]
        FE_Applications["Applications feature\n(status tracking)"]
        FE_Profile["Profile feature\n(candidate data)"]
        FE_Dashboard["Dashboard feature"]
        FE_Core["Core\n(API service · auth guard\n· layout · state)"]
        FE_Core --> FE_Auth & FE_Jobs & FE_Applications & FE_Profile & FE_Dashboard
    end

    subgraph Backend["Backend (Django 6 + DRF)"]
        direction TB
        API_Auth["/api/auth/\naccounts app\n(token auth)"]
        API_Jobs["/api/jobs/\njobs app\n(CRUD · import-url · analyze · match)"]
        API_Applications["/api/applications/\napplications app"]
        API_Profile["/api/profile/\nprofiles app"]
        API_AI["/api/ai/\nai app"]

        subgraph AI_Layer["AI layer (apps/ai)"]
            LLM_Client["LLMClient\n(OpenAI SDK)"]
            Analyzer["JobAnalyzer"]
            Matcher["Matcher"]
            ContentGen["ContentGenerator"]
            LLM_Client --> Analyzer & Matcher & ContentGen
        end

        subgraph Import_Layer["Import layer (apps/jobs/services)"]
            Importer["JobImporter"]
            Fetcher["HTMLFetcher"]
            Detector["SourceDetector"]
            LinkedIn["LinkedInParser"]
            HelloWork["HelloWorkParser"]
            Generic["GenericParser"]
            Fetcher --> Detector
            Detector --> LinkedIn & HelloWork & Generic
            Importer --> Fetcher
            Importer --> Analyzer
        end

        API_Jobs --> Importer & Analyzer & Matcher
        API_AI --> LLM_Client
    end

    subgraph Storage["Storage"]
        SQLite[("SQLite\n(development)")]
        PostgreSQL[("PostgreSQL Azure\n(production)")]
    end

    subgraph External["External services"]
        LLM_API["OpenAI-compatible LLM\n(Tongyi / Qwen)"]
        JobSites["Job sites\n(LinkedIn · HelloWork · generic)"]
    end

    Frontend -- "HTTP + Token Auth" --> Backend
    LLM_Client -- "HTTPS" --> LLM_API
    Fetcher -- "HTTPS" --> JobSites
    Backend -- "ORM" --> SQLite
    Backend -- "ORM" --> PostgreSQL
```

## License

This project is licensed under the terms in [`LICENSE`](LICENSE).
