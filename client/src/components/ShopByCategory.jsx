import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: '3D AI Invitation',
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
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18M5 21V10l7-6 7 6v11M9 21v-6a3 3 0 0 1 6 0v6M9 9h.01M15 9h.01"/>
      </svg>
    ),
  },
  {
    name: 'Caricature & Save The Date',
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
  {
    name: 'Minimal & Modern',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 0 0-5 5c0 3.5 5 10 5 10s5-6.5 5-10a5 5 0 0 0-5-5z"/>
        <path d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        <circle cx="12" cy="7" r="1" fill="#9a6428"/>
      </svg>
    ),
  },
  {
    name: 'Muslim Invitations',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a9 9 0 1 0 8.2 12.8A7 7 0 0 1 12 3z"/>
        <polygon points="17 6 18 8 20 8 18.5 9.5 19 11.5 17 10.5 15 11.5 15.5 9.5 14 8 16 8 17 6" fill="#9a6428" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'South Indian',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2 4h-4l2-4zM6 8h12l-2 5H8L6 8zM5 15h14v2H5v-2zM8 17v4h8v-4"/>
      </svg>
    ),
  },
  {
    name: 'Custom Designs',
    isPopular: false,
    icon: (
      <svg className="w-6 h-6 text-[#9a6428]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8"/>
        <rect x="1" y="3" width="22" height="5"/>
        <line x1="10" y1="12" x2="14" y2="12"/>
      </svg>
    ),
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-7 sm:py-9 bg-[#faf6f0] border-b border-[#ebd8c5]/70">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Horizontal Row: Title on Left + 7 Categories on Right */}
        <div className="flex flex-col xl:flex-row xl:items-center gap-5 xl:gap-7">
          
          {/* Section Header (Left) */}
          <div className="xl:w-60 flex-shrink-0 text-left">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#2a0812] leading-tight">
              Shop By Category
            </h2>
            <p className="text-xs text-gray-500 font-body mt-1 leading-snug">
              Find the perfect invitation style for your special day
            </p>
          </div>

          {/* 7 Category Cards (Right) */}
          <div className="flex-1 overflow-visible">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 sm:gap-3">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.name}
                  className="relative pt-3"
                >
                  {/* Red 'Most Popular' Pill Badge on top */}
                  {cat.isPopular && (
                    <div className="absolute top-0.5 left-1/2 -translate-x-1/2 z-20">
                      <span className="bg-gradient-to-r from-maroon via-maroon-light to-maroon text-gold-light border border-gold/40 text-[8px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wider uppercase whitespace-nowrap block">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <Link
                    to={`/shop?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center justify-center p-3 h-28 rounded-2xl bg-white border border-gold/20 shadow-[0_2px_10px_rgba(58,10,30,0.03)] hover:shadow-luxury hover:border-gold hover:-translate-y-1 transition-all text-center group relative z-10"
                  >
                    {/* Circular Icon Holder */}
                    <div className="w-10 h-10 rounded-full bg-cream-50 border border-gold/30 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:bg-gold/15 group-hover:border-gold transition-all">
                      {cat.icon}
                    </div>

                    {/* Label */}
                    <span className="text-[11px] font-semibold text-brandText font-body line-clamp-2 leading-tight group-hover:text-gold-dark transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
