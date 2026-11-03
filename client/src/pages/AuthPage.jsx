import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, register, sendPhoneOtp, loading, error } = useAuthStore();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // OTP Verification States for Registration
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpSuccessMsg, setOtpSuccessMsg] = useState('');

  // OTP Resend Countdown Timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      setFormError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }

    setFormError('');
    setSendingOtp(true);
    setOtpSuccessMsg('');

    const res = await sendPhoneOtp(phone.trim());
    setSendingOtp(false);

    if (res.success) {
      setOtpSent(true);
      setOtpCountdown(res.data?.cooldownSeconds || 60);
      setOtpSuccessMsg(`✨ Verification code sent to ${res.data?.phone || phone}`);
      if (res.data?.devOtp) {
        setDevOtpHint(res.data.devOtp);
      }
      return true;
    } else {
      setFormError(res.message);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setOtpSuccessMsg('');

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) navigate('/');
      else setFormError(res.message);
    } else {
      if (!name.trim()) {
        setFormError('Please enter your full name');
        return;
      }
      if (!phone.trim()) {
        setFormError('Please enter your WhatsApp phone number');
        return;
      }
      if (!email.trim()) {
        setFormError('Please enter your email address');
        return;
      }
      if (!password || password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return;
      }

      // If OTP has not been sent yet, trigger sending OTP
      if (!otpSent) {
        const sent = await handleSendOtp();
        if (sent) {
          setOtpSuccessMsg('Please enter the 6-digit OTP code below to complete registration.');
        }
        return;
      }

      // If OTP was sent but not entered
      if (!otp.trim()) {
        setFormError('Please enter the 6-digit OTP code sent to your phone');
        return;
      }

      const res = await register(name, email, password, phone, otp);
      if (res.success) navigate('/');
      else setFormError(res.message);
    }
  };

  const handleTabSwitch = (loginTab) => {
    setIsLogin(loginTab);
    setFormError('');
    setOtpSuccessMsg('');
    setOtp('');
    setOtpSent(false);
    setDevOtpHint('');
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
            onClick={() => handleTabSwitch(true)}
            className={`py-2 rounded-xl transition-all ${
              isLogin ? 'bg-maroon text-gold-light shadow-sm' : 'text-brandText-muted hover:text-maroon'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-brandText">WhatsApp Phone Number</label>
                  {otpSent && (
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" /> OTP Dispatched
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (otpSent) {
                        setOtpSent(false);
                        setOtp('');
                        setDevOtpHint('');
                        setOtpSuccessMsg('');
                      }
                    }}
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    disabled={sendingOtp || otpCountdown > 0 || !phone.trim()}
                    onClick={handleSendOtp}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-maroon text-gold-light text-[10px] font-semibold hover:bg-maroon-dark transition-all disabled:opacity-40 disabled:pointer-events-none shadow-sm"
                  >
                    {sendingOtp ? 'Sending...' : otpCountdown > 0 ? `${otpCountdown}s` : otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {/* 6-Digit OTP Field */}
              {otpSent && (
                <div className="p-3 rounded-2xl bg-cream-50 border border-gold/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-brandText flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-dark inline" /> 6-Digit Phone OTP
                    </label>
                    {devOtpHint && (
                      <span className="text-[10px] bg-gold/20 text-maroon font-mono font-bold px-2 py-0.5 rounded-full border border-gold/30">
                        Demo: {devOtpHint}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-2 rounded-xl border border-gold/40 text-center font-mono font-bold tracking-[0.4em] text-sm text-maroon bg-white focus:outline-none focus:border-maroon shadow-inner"
                    />
                  </div>
                  {otpSuccessMsg && (
                    <p className="text-[11px] text-emerald-700 font-medium text-center">
                      {otpSuccessMsg}
                    </p>
                  )}
                </div>
              )}
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
            disabled={loading || sendingOtp}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>
              {loading
                ? 'Please wait...'
                : isLogin
                ? 'Sign In'
                : !otpSent
                ? 'Get OTP & Register'
                : 'Verify OTP & Create Account'}
            </span>
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
