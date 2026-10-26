import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import MobileBottomNav from './components/MobileBottomNav';
import IntroVideoOverlay from './components/IntroVideoOverlay';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import WishlistPage from './pages/WishlistPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AuthPage from './pages/AuthPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cream text-brandText selection:bg-gold selection:text-maroon">
        {/* Fullscreen 15-second Intro Video Overlay */}
        <IntroVideoOverlay />

        {/* Sticky Luxury Navbar */}
        <Navbar />

        {/* Global Cart Slide-over Drawer */}
        <CartDrawer />

        {/* Dynamic Pages */}
        <main className="flex-grow pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/catalog" element={<ShopPage />} />
            <Route path="/product/:identifier" element={<ProductDetailPage />} />
            <Route path="/video/:identifier" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/track/:orderNumber" element={<OrderTrackingPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Mobile-First Bottom Tab Navigation */}
        <MobileBottomNav />

        {/* Footer with Floating WhatsApp Button */}
        <Footer />
      </div>
    </Router>
  );
}
