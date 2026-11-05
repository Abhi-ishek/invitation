import React, { useState } from 'react';
import videoService from '../services/videoService';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [themeInterest, setThemeInterest] = useState('Royal Traditional');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await videoService.submitContact({
        name,
        email,
        phone,
        weddingDate,
        themeInterest,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send inquiry. Please try again or WhatsApp us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Personalized Wedding Atelier
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-1">
            Connect With Our Wedding Concierge
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted mt-2">
            Have questions about custom storyboards, caricature illustrations, or urgent 12-hour deliveries? We are here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-royal-gradient text-cream border border-gold/30 shadow-luxury space-y-4">
              <h3 className="font-heading text-xl font-bold text-cream">Direct Assistance</h3>
              <p className="text-xs text-cream/80 leading-relaxed">
                Connect with our senior creative director directly on WhatsApp for prompt storyboard reviews.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <a
                  href="https://wa.me/917018353733?text=Hi%20Wedding%20Wishcraft!%20I%20would%20like%20to%20inquire%20about%20a%20wedding%20video."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 hover:bg-black/50 transition-colors border border-gold/20"
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold block">WhatsApp Concierge</span>
                    <span className="text-[11px] text-cream/70">+91 70183 53733 (24x7)</span>
                  </div>
                </a>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 border border-gold/20">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Email Inquiries</span>
                    <span className="text-[11px] text-cream/70">concierge@weddingwishcraft.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/30 border border-gold/20">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                  <div>
                    <span className="font-bold block">Production Studios</span>
                    <span className="text-[11px] text-cream/70">Udaipur • Mumbai • New Delhi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gold/25 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-maroon">Message Sent With Love!</h3>
                <p className="text-xs text-brandText-muted max-w-sm mx-auto">
                  Thank you, {name}! Our wedding invitation specialist will reach out to you within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-maroon text-gold-light text-xs font-semibold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading text-xl font-bold text-maroon pb-2 border-b border-gold/15">
                  Send Your Inquiry
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditi Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. aditi@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Wedding Date</label>
                    <input
                      type="text"
                      placeholder="e.g. December 2026"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Design Style of Interest</label>
                  <select
                    value={themeInterest}
                    onChange={(e) => setThemeInterest(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  >
                    <option value="Royal Traditional">Royal Traditional (Palaces & Forts)</option>
                    <option value="3D AI Invitation">3D AI Avatar Invitation</option>
                    <option value="Caricature & Save The Date">Caricature Love Story</option>
                    <option value="Minimal & Modern">Minimal & Modern Noir</option>
                    <option value="Muslim Invitations">Muslim Invitations (Nikah & Walima)</option>
                    <option value="South Indian">South Indian Temple</option>
                    <option value="Custom Designs">Completely Custom Bespoke Concept</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Your Message or Custom Vision *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Tell us about your wedding events, music choices, or custom ideas..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                {error && <p className="text-xs text-rose-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Send Message to Concierge'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
