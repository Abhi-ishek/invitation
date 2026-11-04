import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Video, UserCheck, Zap } from 'lucide-react';
import SampleVideoModal from './SampleVideoModal';

export default function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-[#1c040a] text-cream min-h-[520px] md:min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Wedding Couple Image with Rich Ambient Warm Glow */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2000&q=85"
            alt="Royal Wedding Bride & Groom"
            className="w-full h-full object-cover object-[center_35%] scale-105"
          />
          {/* Subtle Warm Vignette Overlay so text pops while keeping groom and bride visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c040a]/95 via-[#1c040a]/75 to-[#1c040a]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_transparent_20%,_rgba(28,4,10,0.6)_100%)]" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Subtitle, 3 Pills, CTA */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Spaced Gold Category Tag */}
              <div className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-gold-light/90">
                PREMIUM WEDDING INVITATION VIDEOS
              </div>

              {/* Big Serif Heading + Flowing Script Subheading */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.15]">
                Your Dream Wedding <br className="hidden sm:block" />
                <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#f3d9a2] font-normal italic inline-block mt-1">
                  Starts Here
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-cream/90 max-w-xl font-body font-light leading-relaxed">
                Beautiful 3D AI & Traditional Invitation Videos that turn your special moments into timeless memories.
              </p>

              {/* 3 Outlined Feature Pill Badges */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-gold/30 backdrop-blur-md text-[11px] sm:text-xs text-cream font-body shadow-sm">
                  <Video className="w-3.5 h-3.5 text-gold-light" />
                  <span>Ultra-HD 4K Renders</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-gold/30 backdrop-blur-md text-[11px] sm:text-xs text-cream font-body shadow-sm">
                  <UserCheck className="w-3.5 h-3.5 text-gold-light" />
                  <span>Custom Names & Details</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-gold/30 backdrop-blur-md text-[11px] sm:text-xs text-cream font-body shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-gold-light" />
                  <span>24H Express Delivery</span>
                </div>
              </div>

              {/* Shop Now Pill Button */}
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#E8C887] via-[#FFF3D6] to-[#D4A85A] hover:from-[#F4DEB2] hover:to-[#E8C887] text-[#2c0813] font-bold text-xs sm:text-sm tracking-wide shadow-[0_4px_25px_rgba(212,168,90,0.4)] hover:shadow-[0_6px_30px_rgba(212,168,90,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 group font-body"
                >
                  <span>Explore Royal Collection</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Floating Cursive Quote & Play Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center text-center lg:text-right space-y-6 pt-6 lg:pt-0"
            >
              {/* Handwritten Romantic Quote */}
              <div className="max-w-xs sm:max-w-sm">
                <p className="font-script text-3xl sm:text-4xl text-[#f5dfb8] leading-snug drop-shadow-md">
                  Not just an invitation, but a story of your love...
                </p>
              </div>

              {/* Circular Play Button + Watch Sample */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-white/60 bg-black/35 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 group-hover:border-gold transition-all duration-300 shadow-lg">
                  <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                </div>
                <span className="text-sm font-semibold text-cream group-hover:text-gold transition-colors font-body">
                  Watch Sample
                </span>
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Video Modal Trigger */}
      <SampleVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl="https://res.cloudinary.com/vrljkq9h/video/upload/q_auto,vc_auto/Sample_1.mp4"
        title="Royal 3D AI Wedding Invitation Preview"
      />
    </>
  );
}
