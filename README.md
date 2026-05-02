# Cravon 🍕 | Full-Stack Food Delivery Platform

Cravon is a production-ready food delivery platform built with a modern stack. It features a scalable backend, a dynamic frontend, and real-world payment integration.

---

## 🛠 Tech Stack
- **Backend**: Django 4.2+, Django REST Framework
- **Database**: MongoDB Atlas (NoSQL)
- **Frontend**: React 19, Vite, Tailwind-inspired Vanilla CSS
- **Payments**: Razorpay API
- **DevOps**: Docker, Docker Compose, Gunicorn, WhiteNoise
- **State Management**: React Hooks (Optimized for performance)

---

## 🚀 Quick Start (Docker - Recommended)
The fastest way to get Cravon running is using Docker:

```bash
docker-compose up --build
```
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8000`

---

## 🛠 Manual Setup

### Backend
1. **Virtual Env**: `python -m venv venv`
2. **Install**: `pip install -r backend/requirements.txt`
3. **Environment**: Configure `.env` with your `MONGODB_URI` and `RAZORPAY` keys.
4. **Run**: `python manage.py runserver`

### Frontend
1. **Install**: `cd frontend && npm install`
2. **Run**: `npm run dev`

---

## 🏗 Production-Grade Features
- **Scalable Database**: Integrated with **MongoDB Atlas** for flexible menu structures.
- **Security**: 
  - Environment variable protection using `python-decouple`.
  - Secure **CORS** configuration for frontend/backend isolation.
  - CSRF protection for checkout flows.
- **Performance**:
  - **WhiteNoise** integration for efficient static file serving.
  - Gunicorn as the WSGI HTTP Server.
  - Optimized React build pipeline.
- **Containerization**: Fully Dockerized for "write once, run anywhere" capability.

---

## 🔑 Login Credentials
- **Admin**: Create via `python manage.py createsuperuser`
- **Customer**: Use the built-in Sign Up interface.

---

## 📈 Future Roadmap
- [ ] Real-time order tracking via WebSockets (Django Channels).
- [ ] Geo-location for nearest restaurant discovery.
- [ ] Automated CI/CD pipeline via GitHub Actions.
