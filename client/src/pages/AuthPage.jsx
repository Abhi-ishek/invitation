import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, loading, error } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) navigate('/');
      else setFormError(res.message);
    } else {
      if (!name) {
        setFormError('Please enter your full name');
        return;
      }
      const res = await register(name, email, password, phone);
      if (res.success) navigate('/');
      else setFormError(res.message);
    }
  };

  const handlePrefill = (role) => {
    if (role === 'admin') {
      setEmail('admin@weddingwishcraft.com');
      setPassword('Wishcraft@2026');
      setIsLogin(true);
    } else {
      setEmail('couple@weddingwishcraft.com');
      setPassword('Love@2026');
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gold/30 shadow-luxury space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-gold to-gold-light p-[2px] shadow-gold-glow flex items-center justify-center">
            <div className="w-full h-full bg-maroon rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-light" />
            </div>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-maroon">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h1>
          <p className="text-xs text-brandText-muted">
            {isLogin
              ? 'Access your wedding invitation video orders & saved wishlist'
              : 'Join Wedding Wishcraft for personalized wedding cinema'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-cream-50 rounded-2xl border border-gold/20 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setFormError(''); }}
            className={`py-2 rounded-xl transition-all ${
              isLogin ? 'bg-maroon text-gold-light shadow-sm' : 'text-brandText-muted hover:text-maroon'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setFormError(''); }}
            className={`py-2 rounded-xl transition-all ${
              !isLogin ? 'bg-maroon text-gold-light shadow-sm' : 'text-brandText-muted hover:text-maroon'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-brandText mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
                  <input
                    type="text"
                    required
                    placeholder="Aditi Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brandText mb-1">WhatsApp Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-brandText mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
              <input
                type="email"
                required
                placeholder="couple@weddingwishcraft.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brandText mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {(formError || error) && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {formError || error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins for Fast Testing */}
        <div className="pt-4 border-t border-gold/15 space-y-2">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-brandText-muted text-center">
            One-Click Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePrefill('admin')}
              className="py-1.5 px-3 rounded-lg bg-cream-100 hover:bg-gold/20 text-maroon font-semibold border border-gold/20 transition-all text-center"
            >
              Demo Admin 👑
            </button>
            <button
              type="button"
              onClick={() => handlePrefill('customer')}
              className="py-1.5 px-3 rounded-lg bg-cream-100 hover:bg-gold/20 text-maroon font-semibold border border-gold/20 transition-all text-center"
            >
              Demo Couple 💍
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
