# Academic Management System Backend

Professional Django backend foundation for the Academic Management System.

## Stack

- Python
- Django
- Django REST Framework
- MySQL
- JWT authentication with `djangorestframework-simplejwt`
- CORS support with `django-cors-headers`
- Environment-based settings with `python-dotenv`

## Project Structure

```txt
backend/
  manage.py
  requirements.txt
  .env.example
  api/
    __init__.py
    urls.py
    views.py
  apps/
    accounts/
    students/
    teachers/
    courses/
    assignments/
    grades/
    attendance/
    notifications/
    analytics/
  config/
    __init__.py
    asgi.py
    urls.py
    wsgi.py
    settings/
      __init__.py
      base.py
      development.py
      production.py
```

## API Structure

```txt
/api/health/
/api/auth/
/api/auth/register/
/api/auth/login/
/api/auth/logout/
/api/auth/profile/
/api/auth/token/
/api/auth/token/refresh/
/api/auth/token/verify/
/api/students/
/api/teachers/
/api/courses/
/api/assignments/
/api/grades/
/api/attendance/
/api/notifications/
/api/analytics/
```

## Health Check

```http
GET /api/health/
```

Response:

```json
{
  "status": "Backend running successfully"
}
```

## Authentication

Register:

```http
POST /api/auth/register/
```

```json
{
  "username": "student1",
  "email": "student1@example.com",
  "password": "StrongPass123!",
  "password2": "StrongPass123!",
  "role": "STUDENT"
}
```

Login:

```http
POST /api/auth/login/
```

```json
{
  "email": "student1@example.com",
  "password": "StrongPass123!"
}
```

Use the returned access token for authenticated requests:

```http
Authorization: Bearer <access_token>
```

Profile:

```http
GET /api/auth/profile/
```

Refresh:

```http
POST /api/auth/token/refresh/
```

Logout:

```http
POST /api/auth/logout/
```

```json
{
  "refresh": "<refresh_token>"
}
```

## Local Setup

From the repository root:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Create a MySQL database:

```sql
CREATE DATABASE ams_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update `.env` with your MySQL username and password.

For quick local development without a running MySQL service, use:

```env
DB_ENGINE=sqlite
```

For the project MySQL setup, use:

```env
DB_ENGINE=mysql
DB_NAME=ams_db
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

Run migrations:

```bash
python manage.py migrate
```

Start the development server:

```bash
python manage.py runserver
```

Open:

```txt
http://127.0.0.1:8000/api/health/
```

## Settings

Development uses:

```txt
config.settings.development
```

Production uses:

```txt
config.settings.production
```

Set a different settings module with:

```bash
export DJANGO_SETTINGS_MODULE=config.settings.production
```

## Notes

- Models are intentionally not created yet.
- Each app has its own `urls.py` prepared for future API endpoints.
- JWT token endpoints are available under `/api/auth/token/`.
- The default API permission is authenticated access; the health endpoint is public.
