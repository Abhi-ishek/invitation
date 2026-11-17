import React, { useState } from 'react';
import videoService from '../services/videoService';
import { Mail, MessageCircle, Send, CheckCircle2, Sparkles, Instagram, Globe } from 'lucide-react';

export default function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [themeInterest, setThemeInterest] = useState('3D AI Wedding Invitation');
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
      setError(err.message || 'Failed to send inquiry. Please WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact-section" className="py-12 sm:py-16 bg-[#f7f2ea] border-t border-gold/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            💌 Let's Make Your Wedding Invitation Magical!
          </span>
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-maroon">
            Contact Wedding Wishcraft
          </h2>
          <p className="text-xs sm:text-sm text-brandText-muted font-body leading-relaxed">
            Have a wedding coming up? Get in touch with us for customized 4K 3D AI designs, pricing, and fast WhatsApp previews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gold/25 shadow-luxury space-y-4">
              <h3 className="font-heading text-lg font-bold text-maroon">
                We're Here to Help!
              </h3>
              
              <div className="space-y-3 font-body text-xs sm:text-sm">
                
                {/* WhatsApp */}
                <a
                  href="https://wa.me/917018353733?text=Hi%20Wedding%20Wishcraft!%20I%20would%20like%20to%20inquire%20about%20a%20wedding%20invitation%20video."
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-cream-50 hover:bg-gold/10 border border-gold/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#25d366]/15 text-[#25d366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                      WhatsApp Concierge
                    </span>
                    <span className="font-bold text-maroon text-sm">
                      7018353733
                    </span>
                    <p className="text-[10px] text-brandText-muted">
                      Instant response & sample previews
                    </p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@weddingwishcraft.in"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-cream-50 hover:bg-gold/10 border border-gold/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-maroon/10 text-maroon flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-4 h-4 text-maroon" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                      Email
                    </span>
                    <span className="font-bold text-maroon text-xs sm:text-sm">
                      support@weddingwishcraft.in
                    </span>
                  </div>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/weddingwishcraft?obrf=MmE5ZzkwNzZ4NXJl"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 p-3 rounded-2xl bg-cream-50 hover:bg-gold/10 border border-gold/20 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-500/15 text-pink-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                      Instagram
                    </span>
                    <span className="font-bold text-maroon text-xs sm:text-sm">
                      @weddingwishcraft
                    </span>
                  </div>
                </a>

                {/* Website */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-cream-50 border border-gold/20">
                  <div className="w-9 h-9 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                      Website
                    </span>
                    <span className="font-bold text-maroon text-xs sm:text-sm">
                      weddingwishcraft.in
                    </span>
                  </div>
                </div>

              </div>

              {/* Tagline Card */}
              <div className="p-3.5 rounded-2xl bg-[#2d0813] text-cream text-center space-y-0.5">
                <p className="font-script text-lg text-[#f3d9a2]">
                  ✨ Wedding Wishcraft
                </p>
                <p className="text-[10px] text-cream/80">
                  Crafting Invitations, Creating Memories.
                </p>
                <p className="text-[11px] font-semibold text-gold-light pt-0.5">
                  Your dream wedding invitation is just a message away! ❤️
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-gold/25 shadow-luxury">
              <h3 className="font-heading text-lg font-bold text-maroon mb-1">
                Send Us an Inquiry
              </h3>
              <p className="text-xs text-brandText-muted mb-5 font-body">
                Fill in the details below and our concierge team will connect with you promptly.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-cream-50 rounded-2xl border border-gold/30">
                  <CheckCircle2 className="w-12 h-12 text-[#25d366] mx-auto" />
                  <h4 className="font-heading text-xl font-bold text-maroon">
                    Inquiry Received!
                  </h4>
                  <p className="text-xs text-brandText-muted max-w-md mx-auto">
                    Thank you, {name}! We have received your message. You can also chat with us directly on WhatsApp at <strong>7018353733</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-3 text-xs font-bold text-maroon underline hover:text-gold-dark"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 font-body">
                  {error && (
                    <div className="p-2.5 text-xs rounded-xl bg-red-50 text-red-700 border border-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-brandText mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ananya Sharma"
                        className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brandText mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-brandText mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ananya@example.com"
                        className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brandText mb-1">
                        Tentative Wedding Date
                      </label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => setWeddingDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none text-brandText"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-brandText mb-1">
                      Theme Interest
                    </label>
                    <select
                      value={themeInterest}
                      onChange={(e) => setThemeInterest(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none bg-white text-brandText"
                    >
                      <option value="3D AI Wedding Invitation">3D AI Couple Wedding Invitation</option>
                      <option value="Royal Traditional">Royal Traditional Palace Theme</option>
                      <option value="Ring Ceremony / Engagement">Ring Ceremony / Engagement</option>
                      <option value="Haldi Ceremony">Haldi Ceremony Special</option>
                      <option value="Mehendi Magic">Mehendi Magic Invitation</option>
                      <option value="Hindi Shubh Vivah">Hindi Shubh Vivah Patrika</option>
                      <option value="Bespoke Custom Cinema">Bespoke Custom Video Story</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-brandText mb-1">
                      Message / Special Requests
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your wedding ceremonies, music preference, or questions..."
                      className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
