import { create } from 'zustand';
import api from '../services/api';
import { useCartStore } from './useCartStore';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('ww_user') || 'null'),
  token: localStorage.getItem('ww_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, accessToken } = res.data;
      localStorage.setItem('ww_user', JSON.stringify(user));
      localStorage.setItem('ww_token', accessToken);
      set({ user, token: accessToken, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  register: async (name, email, password, phone, otp) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, otp });
      const { user, accessToken } = res.data;
      localStorage.setItem('ww_user', JSON.stringify(user));
      localStorage.setItem('ww_token', accessToken);
      set({ user, token: accessToken, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API call failed:', err.message);
    } finally {
      localStorage.removeItem('ww_user');
      localStorage.removeItem('ww_token');
      localStorage.removeItem('ww_cart_items');
      localStorage.removeItem('ww_cart_coupon');
      set({ user: null, token: null });
      try {
        useCartStore.getState().clearCart();
      } catch (e) {
        // ignore if not initialized
      }
    }
  },

  toggleWishlist: async (productId) => {
    const { user } = get();
    if (!user) return { success: false, message: 'Please login to save to wishlist' };
    try {
      const res = await api.post('/auth/wishlist/toggle', { productId });
      const updatedWishlist = res.data.wishlist;
      const updatedUser = { ...user, wishlist: updatedWishlist };
      localStorage.setItem('ww_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      return { success: true, added: res.data.added };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  sendPhoneOtp: async (phone) => {
    try {
      const res = await api.post('/otp/send', { phone });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  verifyPhoneOtp: async (phone, otp) => {
    try {
      const res = await api.post('/otp/verify', { phone, otp });
      const { user } = get();
      if (user && res.data?.verified) {
        const updatedUser = { ...user, phone: res.data.phone || phone, isPhoneVerified: true };
        localStorage.setItem('ww_user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      }
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
}));
