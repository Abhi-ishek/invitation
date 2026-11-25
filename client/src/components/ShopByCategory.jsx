import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: '3d-ai',
    name: '3D AI Invitation',
    subtitle: 'Hyper-realistic couple cinema',
    image: '/category-3d-ai.jpg',
    link: '/shop?category=3D%20AI%20Invitation',
  },
  {
    id: 'traditional-hindi',
    name: 'Traditional Hindi Invitations',
    subtitle: 'Heritage palace & Vedic shlokas',
    image: '/category-traditional-hindi.jpg',
    link: '/shop?category=Royal%20Traditional',
  },
  {
    id: 'engagement',
    name: 'Engagement Invitations',
    subtitle: 'Ring ceremony and Sagai special',
    image: '/category-engagement.jpg',
    link: '/shop?search=Engagement',
  },
  {
    id: 'caricature',
    name: 'Caricature Invitations',
    subtitle: 'Playful illustrated love stories',
    image: '/category-caricature.jpg',
    link: '/shop?category=Caricature%20%26%20Save%20The%20Date',
  },
  {
    id: 'trending-500',
    name: 'Trending Wedding Invitation - Now Rs 500',
    subtitle: 'Flat 50% Off Premium Wedding Invitation',
    image: '/category-trending-500.jpg',
    link: '/shop',
  },
  {
    id: 'trending-300',
    name: 'Special Offer - Now Rs 300',
    subtitle: 'Limited Time Offer Wedding Invitation',
    image: '/category-trending-300.jpg',
    link: '/shop',
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-8 sm:py-10 bg-[#faf6f0] border-b border-[#ebd8c5]/70 overflow-hidden">
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

      </div>

      {/* Single-Row Continuous Right-to-Left Flowing Marquee */}
      <div className="marquee-wrapper relative w-full overflow-hidden py-2">
        {/* Soft Left & Right Edge Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-20 bg-gradient-to-r from-[#faf6f0] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-20 bg-gradient-to-l from-[#faf6f0] to-transparent z-10" />

        <div className="animate-marquee-rtl">
          {[...CATEGORIES, ...CATEGORIES].map((cat, idx) => (
            <div
              key={`${cat.id}-${idx}`}
              className="flex-shrink-0 pr-4 sm:pr-6"
            >
              <Link
                to={cat.link}
                className="group relative rounded-2xl overflow-hidden border border-gold/30 hover:border-gold shadow-luxury hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 block bg-white w-[270px] sm:w-[320px] lg:w-[350px] aspect-[2/1]"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 select-none"
                  loading="lazy"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gold/25 group-hover:ring-gold/60 transition-all pointer-events-none" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
