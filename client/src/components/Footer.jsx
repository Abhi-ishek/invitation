import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, MessageCircle, Facebook, Phone } from 'lucide-react';

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
              {/* Social Icons & Contact */}
              <div className="flex flex-wrap items-center gap-3 text-cream/80">
                <a
                  href="https://www.instagram.com/weddingwishcraft?obrf=MmE5ZzkwNzZ4NXJl"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors p-1"
                  aria-label="Instagram"
                  title="Instagram @weddingwishcraft"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1EFvMvu23e/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors p-1"
                  aria-label="Facebook"
                  title="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://wa.me/917018353733?text=Hi%20Wedding%20Wishcraft!%20I%20would%20like%20to%20customize%20a%20wedding%20invitation%20video."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-colors p-1"
                  aria-label="WhatsApp"
                  title="WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="tel:+917018353733"
                  className="hover:text-gold transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#320a16] border border-gold/30 text-gold-light"
                  aria-label="Call +91 70183 53733"
                  title="Call Us"
                >
                  <Phone className="w-3 h-3 text-gold" />
                  <span className="text-[11px] font-medium tracking-wide">7018353733</span>
                </a>
              </div>

              <span>© 2025 Wedding Wishcraft. All rights reserved.</span>
            </div>

          </div>
        </div>
      </footer>

      {/* Floating Bright Green WhatsApp Button on Bottom Right */}
      <a
        href="https://wa.me/917018353733?text=Hi%20Wedding%20Wishcraft!%20I%20would%20like%20to%20customize%20a%20wedding%20invitation%20video."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        title="Chat on WhatsApp (7018353733)"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-white" />
      </a>
    </>
  );
}
