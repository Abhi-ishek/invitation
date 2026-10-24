import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="bg-[#24060e] text-cream border-t border-gold/20 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: Brand Logo */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center p-1.5 bg-[#320a16] shadow-inner">
                {/* Lotus Emblem */}
                <svg className="w-6 h-6 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3c1.5 2.8 3.8 5.8 3.8 8.7a3.8 3.8 0 0 1-7.6 0c0-2.9 2.3-5.9 3.8-8.7z" fill="rgba(212, 168, 90, 0.15)"/>
                  <path d="M12 11.7c-2.4-1.6-5.8-1.5-7.2.5-1.4 1.9-.1 4.3 1.9 5.3 2.4 1.1 4.8.4 5.3-.6"/>
                  <path d="M12 11.7c2.4-1.6 5.8-1.5 7.2.5 1.4 1.9.1 4.3-1.9 5.3-2.4 1.1-4.8.4-5.3-.6"/>
                  <path d="M12 16.8c-2.9 1-4.8 2.4-3.8 3.8 1 1.4 3.8 1 7.6 0 1-1.4-.9-2.8-3.8-3.8z"/>
                </svg>
              </div>
              <div>
                <span className="font-heading text-lg font-bold tracking-normal text-cream block leading-tight">
                  Wedding Wishcraft
                </span>
                <span className="block text-[8px] tracking-[0.22em] uppercase text-gold-light/90 font-body">
                  INVITATIONS • FILMS • EMOTIONS
                </span>
              </div>
            </Link>

            {/* Middle: Horizontal Nav Links separated by | */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-cream/80 font-body">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span className="text-cream/30">|</span>
              <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
              <span className="text-cream/30">|</span>
              <Link to="/my-orders" className="hover:text-gold transition-colors">My Orders</Link>
              <span className="text-cream/30">|</span>
              <Link to="/about" className="hover:text-gold transition-colors">About Us</Link>
              <span className="text-cream/30">|</span>
              <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
            </div>

            {/* Right: Social Media Icons + Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-cream/70 font-body">
              {/* Social Icons */}
              <div className="flex items-center space-x-3 text-cream/80">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                {/* Pinterest SVG */}
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors"
                  aria-label="Pinterest"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.95-.13-2.42.03-3.46.14-.94.94-6.17.94-6.17s-.24-.48-.24-1.2c0-1.12.65-1.96 1.46-1.96.69 0 1.02.52 1.02 1.14 0 .7-.44 1.73-.67 2.69-.19.81.4 1.47 1.2 1.47 1.44 0 2.54-1.52 2.54-3.71 0-1.94-1.39-3.3-3.39-3.3-2.48 0-3.93 1.86-3.93 3.78 0 .75.29 1.55.65 1.99.07.09.08.17.06.26-.06.27-.21.86-.24.98-.04.16-.13.19-.3.12-1.13-.53-1.84-2.18-1.84-3.51 0-2.86 2.08-5.49 5.99-5.49 3.15 0 5.6 2.24 5.6 5.25 0 3.13-1.97 5.65-4.71 5.65-.92 0-1.78-.48-2.08-1.04l-.56 2.15c-.2 1.15-.75 2.59-1.12 3.49A12 12 0 1 0 12 0z"/>
                  </svg>
                </a>
              </div>

              <span>© 2025 Wedding Wishcraft. All rights reserved.</span>
            </div>

          </div>
        </div>
      </footer>

      {/* Floating Bright Green WhatsApp Button on Bottom Right */}
      <a
        href="https://wa.me/919876543210?text=Hi%20Wedding%20Wishcraft!%20I%20would%20like%20to%20customize%20a%20wedding%20invitation%20video."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white" />
      </a>
    </>
  );
}
