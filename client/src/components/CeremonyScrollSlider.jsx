import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 'royal',
    title: 'Royal Wedding Celebration',
    src: '/scroll-banner-royal.jpg',
    link: '/shop',
  },
  {
    id: 'ring',
    title: 'Ring Ceremony Invitations',
    src: '/scroll-banner-ring.jpg',
    link: '/shop?category=engagement',
  },
  {
    id: 'haldi',
    title: 'Haldi Ceremony Invitations',
    src: '/scroll-banner-haldi.jpg',
    link: '/shop?category=haldi',
  },
  {
    id: 'mehendi',
    title: 'Mehendi Magic',
    src: '/scroll-banner-mehendi.jpg',
    link: '/shop?category=mehendi',
  },
];

export default function CeremonyScrollSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const total = SLIDES.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    if (isPaused) return;
    timeoutRef.current = setInterval(() => {
      nextSlide();
    }, 2000); // 2s per card: 700ms smooth 3D flip + 1300ms pause to admire the artwork

    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [current, isPaused]);

  return (
    <section
      className="py-4 sm:py-6 bg-[#faf6f0]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3D Perspective Viewport */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-gold/30 bg-[#1c040d]"
          style={{ perspective: '1200px' }}
        >
          {/* Card Frame holding pure image */}
          <div className="relative w-full aspect-[2/1] sm:aspect-[2.3/1] md:aspect-[2.5/1] max-h-[500px]">
            {SLIDES.map((slide, idx) => {
              const isCurrent = idx === current;
              const isPrev = idx === (current - 1 + total) % total;

              // 3D Card Flip Transforms:
              // Current card: flat, fully visible (opacity 1, rotateY 0, scale 1)
              // Exiting (prev) card: flips away with -90deg rotateY and scales slightly down
              // Upcoming cards: ready at +90deg rotateY
              let transformStyle = 'rotateY(90deg) scale(0.92)';
              let opacity = 0;
              let pointerEvents = 'none';
              let zIndex = 0;

              if (isCurrent) {
                transformStyle = 'rotateY(0deg) scale(1)';
                opacity = 1;
                pointerEvents = 'auto';
                zIndex = 10;
              } else if (isPrev) {
                transformStyle = 'rotateY(-90deg) scale(0.92)';
                opacity = 0;
                pointerEvents = 'none';
                zIndex = 5;
              }

              return (
                <div
                  key={slide.id}
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform"
                  style={{
                    transform: transformStyle,
                    opacity: opacity,
                    zIndex: zIndex,
                    pointerEvents: pointerEvents,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <Link to={slide.link} className="w-full h-full flex items-center justify-center">
                    <img
                      src={slide.src}
                      alt={slide.title}
                      className="w-full h-full object-contain mx-auto select-none"
                      loading="lazy"
                    />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
