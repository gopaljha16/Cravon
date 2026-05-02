# CRAVON. 🍽️
### The Gold Standard of Food Delivery

Cravon is a high-fidelity, production-grade SaaS platform for food delivery, built for speed, security, and a boutique user experience. It bridges the gap between world-class kitchens and the modern dining table.

---

## ✨ Key Features

- **Artisanal UI/UX**: A "Luxury Boutique" themed interface with fluid typography, glassmorphism, and smooth entrance animations.
- **Dynamic Restaurant Discovery**: Advanced filtering by cuisine, rating, and trending status with live search suggestions.
- **Master-Detail Menu System**: A responsive "Master-Detail" flow on mobile for seamless navigation between restaurants and menus.
- **Secure Payment Suite**: Full integration with **Razorpay** for online payments, alongside a reliable Cash on Delivery (COD) option.
- **Administrative Control**: A robust portal for restaurant partners to manage menus, track orders, and view performance analytics.
- **Real-time Order Lifecycle**: End-to-end order management from placement through preparation to delivery status.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons |
| **Backend** | Django 6.0, Django REST Framework |
| **Database** | MongoDB Atlas (via Djongo Connector) |
| **Payments** | Razorpay SDK & Python Library |
| **Deployment** | Vercel (Frontend), Render (Backend), WhiteNoise (Statics) |

---

## 🚀 Installation & Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas Account

### 1. Clone the Repository
```bash
git clone https://github.com/gopaljha16/Cravon.git
cd Cravon
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend` folder (use `.env.example` as a template) and add your `MONGODB_URI` and `RAZORPAY` keys.

```bash
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder with `VITE_API_URL=http://localhost:8000`.

```bash
npm run dev
```

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Create a **Web Service** on Render pointing to the `backend` folder.
2. Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
3. Start Command: `gunicorn cravon.wsgi`
4. Add environment variables from `.env.example`.

### Frontend (Vercel)
1. Connect your GitHub repo and select the `frontend` directory as the root.
2. Framework Preset: `Vite`.
3. Add `VITE_API_URL` pointing to your Render URL.
4. Vercel will automatically use the `vercel.json` provided in the repository for routing.

---

## 📸 Elite Aesthetics
The platform features:
- **Responsive Fluid Design**: Perfect experience on mobile, tablet, and 4K displays.
- **Gourmet Visuals**: High-tracking typography and curated color palettes (`#2d4a36` & `#d4a373`).
- **Interactive Modals**: Quick-view dish details and smooth cart updates.

---

## 📜 License
This project is for portfolio purposes and follows the standard MIT license.

---
*Built with ❤️ by the Cravon Team.*
