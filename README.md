# 💍 Wedding Wishcraft — Premium Wedding Video Invitations E-Commerce

A full-stack, production-ready MERN e-commerce web application for bespoke wedding invitation videos (3D AI, Royal Traditional, Caricature & Save The Date, Minimal & Modern, Muslim, South Indian, and Custom designs).

---

## 🏛️ Architecture Overview

- **Frontend (`client/`)**: React 19, Vite, Tailwind CSS, Framer Motion, Axios, Zustand, Lucide React, Canvas Confetti.
- **Backend (`server/`)**: Node.js, Express.js (ES Modules), MongoDB with Mongoose, JWT auth in httpOnly cookies, bcryptjs, Helmet, CORS, Express Rate Limit, Nodemailer.
- **Payments**: Razorpay (UPI, GPay, PhonePe, Cards, Net Banking) & Cash on Delivery (Pay on Approval).
- **Design System**: Royal Indian wedding aesthetics (Deep Maroon `#3A0A1E` / `#5A1030`, Warm Ivory/Cream `#FFF8F0`, Champagne Gold `#E8C887` / `#D4A85A`, *Playfair Display* & *Great Vibes* script typography).

---

## 📁 Folder Structure

```plaintext
Sadi/
├── client/
│   ├── public/
│   │   └── wedding-ring.svg
│   ├── src/
│   │   ├── components/         # Navbar, HeroSection, ShopByCategory, VideoCard, PromoRow,
│   │   │                       # HowItWorks, CartDrawer, MobileBottomNav, Footer, SampleVideoModal
│   │   ├── pages/              # HomePage, ShopPage, ProductDetailPage, CartPage, CheckoutPage,
│   │   │                       # OrderSuccessPage, OrderTrackingPage, WishlistPage, MyOrdersPage,
│   │   │                       # AuthPage, AdminPage, AboutPage, ContactPage, NotFoundPage
│   │   ├── services/           # api.js, videoService.js
│   │   ├── store/              # useCartStore.js, useAuthStore.js
│   │   ├── index.css           # Tailwind base, components, utilities & luxury styling
│   │   └── App.jsx             # React Router v7 routes & layout
│   ├── tailwind.config.js
│   └── package.json
│
└── server/
    ├── src/
    │   ├── config/             # db.js (MongoDB connection)
    │   ├── controllers/        # authController, productController, orderController,
    │   │                       # categoryController, couponController, paymentController,
    │   │                       # reviewController, contactController, healthController
    │   ├── middleware/         # authMiddleware (JWT & admin), errorHandler, rateLimiter
    │   ├── models/             # User, Product, Category, Order, Coupon, Review, ContactMessage
    │   ├── routes/             # authRoutes, productRoutes, categoryRoutes, orderRoutes, etc.
    │   ├── utils/              # apiResponse, apiError, mailer
    │   ├── seed.js             # 12 sample products, 7 categories, coupons, demo accounts
    │   └── server.js           # Server entrypoint
    ├── .env.example
    └── package.json
```

---

## ⚡ Quickstart Commands

### 1. Backend Server Setup

```bash
cd server
npm install
npm run seed       # Seeds 12 video templates, 7 categories, and coupons
npm run dev        # Starts nodemon dev server on http://localhost:5000
```

### 2. Frontend Client Setup

```bash
cd client
npm install
npm run dev        # Starts Vite dev server on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 👑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin Atelier** | `admin@weddingwishcraft.com` | `Wishcraft@2026` |
| **Demo Couple** | `couple@weddingwishcraft.com` | `Love@2026` |

*(You can also click the "One-Click Demo Accounts" buttons on the `/login` page for instant prefill!)*

---

## 🎟️ Active Promo Coupons

- **`WELCOME10`**: 10% Discount on first order.
- **`ROYAL20`**: 20% Discount on royal traditional designs.

---

## 🚢 Deployment Guidelines

### Frontend on Vercel
1. Set Root Directory to `client`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com/api`.

### Backend on Render
1. Set Root Directory to `server`.
2. Build command: `npm install`.
3. Start command: `npm start`.
4. Environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=mongodb+srv://...` (MongoDB Atlas URI)
   - `CLIENT_URL=https://your-app.vercel.app`
   - `ACCESS_TOKEN_SECRET=...`
