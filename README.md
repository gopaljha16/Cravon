# Cravon

Cravon is arranged as a proper full-stack project:

- `backend/` - Django, SQLite, models, admin, and JSON API routes
- `frontend/` - React + Vite app for the customer and admin interface

## Backend

```powershell
cd backend
..\venv\Scripts\python.exe manage.py migrate
..\venv\Scripts\python.exe manage.py runserver
```

API routes are mounted under `/api/`.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

The React app runs at `http://127.0.0.1:5173` and proxies API/media requests to Django at `http://127.0.0.1:8000`.

## Login

- Admin: username `admin`
- Customer: create an account from the Sign up tab
