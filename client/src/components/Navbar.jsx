import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, FileText, Heart, Search, User, LogOut, ShieldCheck, Film, CreditCard } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { items, toggleCart } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalCount = items.length;
  const wishlistCount = user?.wishlist?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#25070f] text-cream border-b border-gold/20 shadow-md transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo: Lotus Emblem + Brand Name & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-11 h-11 rounded-full border border-gold/40 flex items-center justify-center p-1.5 bg-[#320a16] shadow-inner group-hover:border-gold transition-colors">
              {/* Lotus Icon */}
              <svg className="w-7 h-7 text-gold group-hover:scale-105 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c1.5 2.8 3.8 5.8 3.8 8.7a3.8 3.8 0 0 1-7.6 0c0-2.9 2.3-5.9 3.8-8.7z" fill="rgba(212, 168, 90, 0.15)"/>
                <path d="M12 11.7c-2.4-1.6-5.8-1.5-7.2.5-1.4 1.9-.1 4.3 1.9 5.3 2.4 1.1 4.8.4 5.3-.6"/>
                <path d="M12 11.7c2.4-1.6 5.8-1.5 7.2.5 1.4 1.9.1 4.3-1.9 5.3-2.4 1.1-4.8.4-5.3-.6"/>
                <path d="M12 16.8c-2.9 1-4.8 2.4-3.8 3.8 1 1.4 3.8 1 7.6 0 1-1.4-.9-2.8-3.8-3.8z"/>
              </svg>
            </div>
            <div>
              <span className="font-heading text-xl sm:text-2xl font-bold tracking-normal text-cream group-hover:text-gold transition-colors block leading-tight">
                Wedding Wishcraft
              </span>
              <span className="block text-[8px] sm:text-[9px] tracking-[0.26em] uppercase text-gold-light/90 font-body">
                INVITATIONS • FILMS • EMOTIONS
              </span>
            </div>
          </Link>

          {/* Centered White Pill Search Bar with Right Search Icon */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xl mx-2 hidden sm:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by style, theme, or keyword.."
                className="w-full pl-5 pr-12 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-400 text-xs sm:text-[13px] border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:bg-white transition-all font-body"
              />
              <button
                type="submit"
                className="absolute right-3.5 text-gray-600 hover:text-maroon transition-colors"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </form>

          {/* Right Navigation & Icons: Home, Shop, My Orders, Wishlist, User, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5 text-cream/90 text-xs sm:text-[13px] font-body flex-shrink-0">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hidden md:flex items-center gap-1.5 hover:text-gold transition-colors ${
                  isActive ? 'text-gold font-semibold' : 'text-cream/90'
                }`
              }
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </NavLink>

            {/* Shop */}
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `hidden md:flex items-center gap-1.5 hover:text-gold transition-colors ${
                  isActive ? 'text-gold font-semibold' : 'text-cream/90'
                }`
              }
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop</span>
            </NavLink>

            {/* My Orders */}
            <NavLink
              to="/my-orders"
              className={({ isActive }) =>
                `hidden md:flex items-center gap-1.5 hover:text-gold transition-colors ${
                  isActive ? 'text-gold font-semibold' : 'text-cream/90'
                }`
              }
            >
              <FileText className="w-3.5 h-3.5" />
              <span>My Orders</span>
            </NavLink>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden lg:flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Wishlist</span>
            </Link>

            {/* Mobile Wishlist icon */}
            <Link
              to="/wishlist"
              className="lg:hidden p-1.5 text-cream/80 hover:text-gold transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
            </Link>

            {/* Account / User */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-gold/40 text-cream hover:border-gold transition-all"
                >
                  <User className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center p-1.5 text-cream/90 hover:text-gold transition-colors"
                  title="Account"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              {user && userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-luxury border border-gold/25 py-2 z-50 text-brandText text-xs">
                  <div className="px-4 py-2 border-b border-gold/15">
                    <p className="font-bold text-maroon truncate">{user.name}</p>
                    <p className="text-[10px] text-brandText-muted truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gold/10 text-maroon font-semibold"
                    >
                      <ShieldCheck className="w-4 h-4 text-gold-dark" /> Admin Atelier
                    </Link>
                  )}
                  <Link
                    to="/my-orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-cream-100"
                  >
                    <Film className="w-4 h-4 text-brandText-light" /> My Invitations
                  </Link>
                  <Link
                    to="/payments"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-cream-100"
                  >
                    <CreditCard className="w-4 h-4 text-brandText-light" /> Payment History
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 border-t border-gold/10"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Cart with Gold Badge "2" */}
            <button
              onClick={toggleCart}
              className="relative p-1.5 text-cream/90 hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-1 -right-2 bg-gradient-to-r from-gold to-gold-light text-[#25070f] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {totalCount}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar below header */}
        <div className="sm:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by style, theme, or keyword.."
              className="w-full pl-4 pr-10 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 text-xs border border-transparent focus:outline-none focus:ring-2 focus:ring-gold/60"
            />
            <button
              type="submit"
              className="absolute right-3 text-gray-600"
              aria-label="Submit search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
