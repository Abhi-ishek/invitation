import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Film, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function MobileBottomNav() {
  const { items } = useCartStore();
  const { user } = useAuthStore();
  const totalCount = items.length;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-maroon/95 backdrop-blur-lg border-t border-gold/20 shadow-2xl safe-area-bottom">
      <div className="grid grid-cols-4 h-16 items-center text-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'
            }`
          }
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-wide">Shop</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 relative transition-colors ${
              isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'
            }`
          }
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-gold to-gold-dark text-maroon font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-wide">Cart</span>
        </NavLink>

        <NavLink
          to={user ? '/my-orders' : '/login'}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? 'text-gold' : 'text-cream/70 hover:text-cream'
            }`
          }
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium tracking-wide">
            {user ? 'Account' : 'Login'}
          </span>
        </NavLink>
      </div>
    </nav>
  );
}
