import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import videoService from '../services/videoService';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Heart,
  User,
  Users,
  ArrowRight,
  ShieldCheck,
  Check,
  Music,
  Send,
  MessageCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderCustomizationPage() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Groom Details
  const [groomName, setGroomName] = useState('');
  const [groomFatherName, setGroomFatherName] = useState('');
  const [groomMotherName, setGroomMotherName] = useState('');

  // Bride Details
  const [brideName, setBrideName] = useState('');
  const [brideFatherName, setBrideFatherName] = useState('');
  const [brideMotherName, setBrideMotherName] = useState('');

  // Ceremonies
  // 1. Haldi
  const [haldiDate, setHaldiDate] = useState('');
  const [haldiTimings, setHaldiTimings] = useState('');
  const [haldiVenue, setHaldiVenue] = useState('');

  // 2. Wedding Ceremony
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingTimings, setWeddingTimings] = useState('');
  const [weddingVenue, setWeddingVenue] = useState('');

  // 3. Mehendi
  const [mehendiDate, setMehendiDate] = useState('');
  const [mehendiTimings, setMehendiTimings] = useState('');
  const [mehendiVenue, setMehendiVenue] = useState('');

  // Additional Notes / Hashtag
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await videoService.trackOrder(orderNumber);
        const ord = res.data;
        setOrder(ord);

        // Pre-fill existing weddingDetails if available
        if (ord.weddingDetails) {
          const wd = ord.weddingDetails;
          if (wd.groomName) setGroomName(wd.groomName);
          if (wd.groomFatherName) setGroomFatherName(wd.groomFatherName);
          if (wd.groomMotherName) setGroomMotherName(wd.groomMotherName);

          if (wd.brideName) setBrideName(wd.brideName);
          if (wd.brideFatherName) setBrideFatherName(wd.brideFatherName);
          if (wd.brideMotherName) setBrideMotherName(wd.brideMotherName);

          if (wd.haldiDate) setHaldiDate(wd.haldiDate);
          if (wd.haldiTimings) setHaldiTimings(wd.haldiTimings);
          if (wd.haldiVenue) setHaldiVenue(wd.haldiVenue);

          if (wd.weddingDate) setWeddingDate(wd.weddingDate);
          if (wd.weddingTimings) setWeddingTimings(wd.weddingTimings);
          if (wd.weddingVenue) setWeddingVenue(wd.weddingVenue);

          if (wd.mehendiDate) setMehendiDate(wd.mehendiDate);
          if (wd.mehendiTimings) setMehendiTimings(wd.mehendiTimings);
          if (wd.mehendiVenue) setMehendiVenue(wd.mehendiVenue);

          if (wd.additionalNotes) setAdditionalNotes(wd.additionalNotes);
        } else if (ord.items?.[0]?.customizationData) {
          // Fallback to initial customizationData from checkout
          const cd = ord.items[0].customizationData;
          if (cd.groomName) setGroomName(cd.groomName);
          if (cd.brideName) setBrideName(cd.brideName);
          if (cd.weddingDate) setWeddingDate(cd.weddingDate);
          if (cd.venue) setWeddingVenue(cd.venue);
        }
      } catch (err) {
        console.warn('Error fetching order for customization:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fireSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4A85A', '#E8C887', '#3A0A1E', '#5A1030', '#10B981'],
      });
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        groomName,
        groomFatherName,
        groomMotherName,
        brideName,
        brideFatherName,
        brideMotherName,
        haldiDate,
        haldiTimings,
        haldiVenue,
        weddingDate,
        weddingTimings,
        weddingVenue,
        mehendiDate,
        mehendiTimings,
        mehendiVenue,
        additionalNotes,
      };

      await videoService.saveWeddingDetails(orderNumber, payload);
      setSavedSuccess(true);
      fireSuccessConfetti();

      // Navigate to order-success after a short pleasant pause
      setTimeout(() => {
        navigate(`/order-success/${encodeURIComponent(orderNumber)}`);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save wedding details. Please try again.');
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate(`/order-success/${encodeURIComponent(orderNumber)}`);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Celebration Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-luxury mb-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Payment Confirmed • Order {orderNumber}</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-bold text-maroon">
            Wedding & Ceremony Invitation Details
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted max-w-xl mx-auto">
            Please share the bride, groom, and ceremony details below so our studio artists can personalize your royal 4K invitation video.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Details saved successfully! Redirecting to confirmation...</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. GROOM & FAMILY SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-maroon text-gold-light flex items-center justify-center shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-maroon">
                  Groom & Family Details
                </h2>
                <p className="text-[11px] text-brandText-muted">
                  Names as they should appear on the royal invitation video
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Groom Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Groom Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={groomName}
                  onChange={(e) => setGroomName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>

              {/* Father's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Father's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Rajesh Sharma"
                  value={groomFatherName}
                  onChange={(e) => setGroomFatherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>

              {/* Mother's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Mother's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Sunita Sharma"
                  value={groomMotherName}
                  onChange={(e) => setGroomMotherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. BRIDE & FAMILY SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-maroon text-gold-light flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-maroon">
                  Bride & Family Details
                </h2>
                <p className="text-[11px] text-brandText-muted">
                  Names as they should appear on the royal invitation video
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Bride Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Bride Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi Verma"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>

              {/* Father's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Father's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Anil Verma"
                  value={brideFatherName}
                  onChange={(e) => setBrideFatherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>

              {/* Mother's Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-maroon uppercase tracking-wider">
                  Mother's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mrs. Meenakshi Verma"
                  value={brideMotherName}
                  onChange={(e) => setBrideMotherName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon text-brandText font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. CEREMONIES SECTION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gold/15 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-gold/20 text-maroon flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-maroon">
                  Ceremonies, Dates & Venues
                </h2>
                <p className="text-[11px] text-brandText-muted">
                  Use the calendar pickers to select the exact celebration dates and timings
                </p>
              </div>
            </div>

            {/* HALDI CEREMONY CARD */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm font-bold text-maroon flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  Haldi Ceremony
                </span>
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pre-Wedding
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-dark" /> Haldi Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={haldiDate}
                    onChange={(e) => setHaldiDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-dark" /> Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM onwards"
                    value={haldiTimings}
                    onChange={(e) => setHaldiTimings(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-dark" /> Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sun Garden Lawn, Jaipur"
                    value={haldiVenue}
                    onChange={(e) => setHaldiVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
              </div>
            </div>

            {/* MEHENDI CEREMONY CARD */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200/60 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm font-bold text-maroon flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Mehendi Ceremony
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Pre-Wedding
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-dark" /> Mehendi Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={mehendiDate}
                    onChange={(e) => setMehendiDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-dark" /> Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 04:00 PM onwards"
                    value={mehendiTimings}
                    onChange={(e) => setMehendiTimings(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-dark" /> Venue
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Courtyard Banquet, Jaipur"
                    value={mehendiVenue}
                    onChange={(e) => setMehendiVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium"
                  />
                </div>
              </div>
            </div>

            {/* WEDDING CEREMONY CARD (MAIN) */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-gold/40 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-heading text-sm font-bold text-maroon flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                  Wedding Ceremony (Main Function) *
                </span>
                <span className="text-[10px] uppercase font-bold text-maroon bg-gold/25 px-2 py-0.5 rounded-full border border-gold/30">
                  Auspicious Day
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-dark" /> Wedding Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-dark" /> Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baraat 6 PM • Varmala 8 PM"
                    value={weddingTimings}
                    onChange={(e) => setWeddingTimings(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-maroon mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-dark" /> Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palace Resort, Jaipur"
                    value={weddingVenue}
                    onChange={(e) => setWeddingVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-white focus:outline-none focus:border-maroon text-brandText font-medium shadow-inner"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* 4. ADDITIONAL NOTES & HASHTAGS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-sm space-y-4">
            <h2 className="font-heading text-lg font-bold text-maroon">
              Wedding Hashtag & Special Notes (Optional)
            </h2>
            <textarea
              rows="3"
              placeholder="e.g. Wedding Hashtag: #AditiWedsRohan | Music preference: Romantic shehnai flute blend | RSVP contact numbers..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-maroon text-brandText"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="order-2 sm:order-1 text-xs font-semibold text-brandText-muted hover:text-maroon transition-colors py-2"
            >
              Skip for now (I will share details on WhatsApp)
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="order-1 sm:order-2 w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Saving Details...' : 'Submit Details & Start Video Production'}</span>
            </button>
          </div>

          {/* Security & Assistance Note */}
          <div className="flex items-center justify-center gap-2 text-xs text-brandText-muted pt-4 border-t border-gold/15 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Need assistance? Our creative team is available on WhatsApp at +91 70183 53733</span>
          </div>

        </form>

      </div>
    </div>
  );
}

