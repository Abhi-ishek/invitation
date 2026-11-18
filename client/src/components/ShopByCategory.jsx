import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    name: '3D AI Invitation',
    subtitle: 'Hyper-realistic couple cinema',
    isPopular: true,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
        <circle cx="12" cy="12" r="3" fill="#edd8b8"/>
      </svg>
    ),
  },
  {
    name: 'Royal Traditional',
    subtitle: 'Heritage palace & Vedic shlokas',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6a3 3 0 0 1 6 0v6M9 9h.01M15 9h.01"/>
      </svg>
    ),
  },
  {
    name: 'Caricature & Save The Date',
    subtitle: 'Playful illustrated love stories',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5"/>
        <path d="M7 20c0-3.3 2.2-6 5-6s5 2.7 5 6"/>
        <path d="M10 8.5c0 .3.2.5.5.5s.5-.2.5-.5M13 8.5c0 .3.2.5.5.5s.5-.2.5-.5"/>
        <path d="M10.5 11c.5.5 1.5.5 2 0"/>
      </svg>
    ),
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-8 sm:py-10 bg-[#faf6f0] border-b border-[#ebd8c5]/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-7 sm:mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark block mb-1">
            Bespoke Collections
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#2a0812] leading-tight">
            Shop By Category
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-body mt-1.5 leading-snug">
            Find the perfect invitation style crafted for your special day
          </p>
        </div>

        {/* Centered 3 Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="relative pt-3"
            >
              {/* 'Most Popular' Pill Badge on top */}
              {cat.isPopular && (
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-maroon via-maroon-light to-maroon text-gold-light border border-gold/40 text-[9px] font-bold px-3 py-0.5 rounded-full shadow-sm tracking-wider uppercase whitespace-nowrap block">
                    Most Popular
                  </span>
                </div>
              )}

              <Link
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-white border border-gold/25 shadow-luxury hover:border-gold hover:-translate-y-1 transition-all text-center group relative z-10 min-h-[140px]"
              >
                {/* Circular Icon Holder */}
                <div className="w-12 h-12 rounded-full bg-cream-50 border border-gold/30 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-gold/15 group-hover:border-gold transition-all shadow-inner">
                  {cat.icon}
                </div>

                {/* Title */}
                <span className="text-sm font-bold text-maroon font-heading leading-tight group-hover:text-gold-dark transition-colors">
                  {cat.name}
                </span>

                {/* Subtitle */}
                <span className="text-[11px] text-brandText-muted font-body mt-1">
                  {cat.subtitle}
                </span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
