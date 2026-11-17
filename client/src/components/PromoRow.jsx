import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Video, Sparkles, ShieldCheck, Headphones, Instagram } from 'lucide-react';

export default function PromoRow() {
  return (
    <section className="py-8 sm:py-10 bg-[#faf6f0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          
          {/* 1. Special Offer Banner (Image Only) */}
          <Link
            to="/shop"
            className="group relative rounded-2xl overflow-hidden border border-gold/25 hover:border-gold/60 shadow-luxury transition-all duration-300 transform hover:-translate-y-1 block min-h-[220px]"
          >
            <img
              src="/special-offer-banner.jpg"
              alt="Wedding Wishcraft Special Offer"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-maroon-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* 2. Why Choose Us? */}
          <div className="rounded-2xl bg-white border border-gold/25 hover:border-gold/50 p-6 sm:p-7 flex flex-col justify-between shadow-luxury transition-all">
            <h3 className="font-heading text-lg font-bold text-maroon text-center sm:text-left mb-5">
              Why Choose Us?
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-center my-auto">
              {/* Item 1 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-cream-50 border border-gold/30 flex items-center justify-center text-gold-dark shadow-sm">
                  <Video className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-brandText font-body leading-tight">
                  HD Quality Videos
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-cream-50 border border-gold/30 flex items-center justify-center text-gold-dark shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-brandText font-body leading-tight">
                  Customisation Available
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-cream-50 border border-gold/30 flex items-center justify-center text-gold-dark shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-brandText font-body leading-tight">
                  Secure Payments
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col items-center space-y-2">
                <div className="w-11 h-11 rounded-2xl bg-cream-50 border border-gold/30 flex items-center justify-center text-gold-dark shadow-sm">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-brandText font-body leading-tight">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* 3. Follow Us On Instagram */}
          <div className="rounded-2xl bg-gradient-to-br from-[#faf3ea] to-[#f5e9d9] border border-gold/25 hover:border-gold/50 p-6 sm:p-7 flex items-center justify-between shadow-luxury overflow-hidden transition-all">
            {/* Left Content */}
            <div className="max-w-[55%] space-y-2 text-left">
              <h3 className="font-heading text-base font-bold text-[#2c0813]">
                Follow Us On Instagram
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#2c0813] font-semibold font-body">
                <Instagram className="w-3.5 h-3.5 text-rose-600" />
                <span>@weddingwishcraft</span>
              </div>
              <p className="text-[11px] text-gray-500 font-body leading-snug">
                Get inspired with our latest designs, behind the scenes & more.
              </p>

              {/* Follow Button */}
              <div className="pt-2">
                <a
                  href="https://www.instagram.com/weddingwishcraft?obrf=MmE5ZzkwNzZ4NXJl"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#2d0813] hover:bg-[#431020] text-white text-xs font-semibold shadow-sm transition-all font-body"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                  <span>Follow</span>
                </a>
              </div>
            </div>

            {/* Right Reels Gallery Collage */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=200&q=80"
                alt="Instagram reel 1"
                className="w-16 h-24 object-cover rounded-lg shadow-md absolute -rotate-12 -left-1 border border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80"
                alt="Instagram reel 2"
                className="w-16 h-24 object-cover rounded-lg shadow-md absolute z-10 border border-white"
              />
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=200&q=80"
                alt="Instagram reel 3"
                className="w-16 h-24 object-cover rounded-lg shadow-md absolute rotate-12 -right-1 border border-white"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
