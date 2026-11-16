import React from 'react';
import { Link } from 'react-router-dom';

const CEREMONY_BANNERS = [
  {
    id: 'mehendi',
    title: 'Mehendi Magic',
    subtitle: 'Colorful Invitations for Your Special Day',
    src: '/banner-mehendi.jpg',
    link: '/shop?category=mehendi',
  },
  {
    id: 'ring-ceremony',
    title: 'Ring Ceremony Invitations',
    subtitle: 'A Moment Forever',
    src: '/banner-ring-ceremony.jpg',
    link: '/shop?category=engagement',
  },
  {
    id: 'haldi',
    title: 'Haldi Ceremony Invitations',
    subtitle: 'Bright & Joyful 3D Videos',
    src: '/banner-haldi.jpg',
    link: '/shop?category=haldi',
  },
  {
    id: 'royal-wedding',
    title: 'Royal Wedding Celebration',
    subtitle: 'Luxury Bespoke Video Invitations',
    src: '/banner-royal-wedding.jpg',
    link: '/shop',
  },
];

export default function CeremonyBannersGrid() {
  return (
    <section className="py-4 sm:py-6 bg-[#faf6f0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {CEREMONY_BANNERS.map((banner) => (
            <Link
              key={banner.id}
              to={banner.link}
              className="group relative rounded-2xl overflow-hidden shadow-luxury border border-gold/25 hover:border-gold/60 transition-all duration-300 transform hover:-translate-y-1 block bg-maroon-dark/10 aspect-[16/9]"
            >
              <img
                src={banner.src}
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
