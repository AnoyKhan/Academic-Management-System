# Deployment

## GitHub Pages frontend

This repository deploys only the React/Vite frontend to GitHub Pages. GitHub
Pages cannot run the Django API, JWT services, database, media storage, or
background workers.

The repository is `AnoyKhan/Academic-Management-System`, so the expected
project-site URL is:

`https://anoykhan.github.io/Academic-Management-System/`

The workflow is [.github/workflows/deploy.yml](./.github/workflows/deploy.yml).
It runs on pushes to `main` and can also be started manually with
**Actions → Deploy frontend to GitHub Pages → Run workflow**.

### Required Pages settings

In the repository settings:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Keep the workflow environment named `github-pages`.

The workflow builds `dist/`, copies `index.html` to `404.html` for nested
React Router URLs, uploads the Pages artifact, and deploys it with the
official Pages actions.

### Vite base path

Local development and local preview use `/`. GitHub Actions sets the
repository-site base automatically to:

`/Academic-Management-System/`

`VITE_BASE_PATH` can override this when deploying a user/organization site or
custom domain.

### Frontend API configuration

`VITE_API_BASE_URL` is a public frontend build value. It must contain only the
public HTTPS API origin and path, never credentials, database settings, or
secret keys.

For a deployed frontend, add a repository **Actions variable** named
`VITE_API_BASE_URL` before deployment, for example:

`https://api.example.com/api`

No production backend URL is currently configured or claimed by this
repository. If the variable is omitted, the public build has no configured
production API endpoint and cannot authenticate or load live AMS data.

Local development defaults to `/api`, which is served by the Vite proxy at
`http://127.0.0.1:8000`. Copy [.env.example](./.env.example) to `.env` only
when a local override is needed.

## Django backend requirement

Deploy Django separately on a platform that supports Python processes and a
production database. Do not deploy `backend/` or `db.sqlite3` to GitHub Pages.

The backend production environment must provide, at minimum:

- A strong `SECRET_KEY`
- `DEBUG=False`
- Explicit production `ALLOWED_HOSTS`
- A production database configuration
- `CORS_ALLOWED_ORIGINS` containing the exact HTTPS GitHub Pages origin
- HTTPS/security settings appropriate for the hosting provider
- Production email and media storage configuration where required

The backend environment template is
[backend/.env.example](./backend/.env.example). Never commit the real
`backend/.env`.

## Troubleshooting

- **Assets return 404:** confirm the Pages source is **GitHub Actions** and
  that the build used `/Academic-Management-System/` as its base.
- **Nested route refresh returns 404:** confirm the artifact contains
  `404.html`; the workflow creates it from the built `index.html`.
- **Login or API requests fail:** configure the `VITE_API_BASE_URL` Actions
  variable and allow the Pages origin in Django CORS settings.
- **Workflow cannot deploy:** check that Pages is enabled for the repository
  and that the workflow has `pages: write` and `id-token: write` permissions.
- **Do not use localhost in production:** local proxy settings are for
  development only and are not a production backend.
