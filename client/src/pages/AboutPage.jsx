import React from 'react';
import SEO from '../components/SEO';
import { Sparkles, Heart, Film, Users, ShieldCheck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream py-12 sm:py-20">
      <SEO
        title="About Us"
        description="At Wedding Wishcraft, we believe every wedding begins with a beautiful invitation and every love story deserves a magical announcement. We specialize in elegant 4K 3D AI and royal wedding invitations."
        canonicalUrl="/about"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Crafting Invitations, Creating Memories
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-maroon">
            About Us – Wedding Wishcraft
          </h1>
          <p className="text-brandText-muted text-sm sm:text-base max-w-2xl mx-auto font-body">
            At Wedding Wishcraft, we believe every wedding begins with a beautiful invitation and every love story deserves a magical announcement. ❤️
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gold/25 shadow-luxury space-y-6 text-brandText font-body">
          <p className="text-base sm:text-lg leading-relaxed text-maroon font-serif italic text-center max-w-2xl mx-auto">
            "We specialize in creating elegant, personalized, and creative wedding invitation videos that make your special moments unforgettable. From traditional Indian wedding invitations to modern and luxurious digital invites, we bring your wedding dreams to life with creativity and style."
          </p>

          <div className="border-t border-gold/20 pt-6 space-y-4">
            <h3 className="font-heading text-xl font-bold text-maroon text-center sm:text-left">
              Our Mission
            </h3>
            <p className="text-sm text-brandText-muted leading-relaxed">
              Our mission is to make your wedding invitations unique, memorable, and affordable. We blend beautiful designs, stunning animations, and heartfelt emotions to create invitations that leave a lasting impression on your loved ones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#2d0813] text-cream flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-script text-2xl text-gold-light">
                ✨ Wedding Wishcraft
              </p>
              <p className="text-xs text-cream/80 font-body">
                Crafting Invitations, Creating Memories.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs shadow-md hover:scale-105 transition-all"
            >
              <span>Explore Invitations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Steps Process */}
        <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-sm space-y-6">
          <h2 className="font-heading text-2xl font-bold text-maroon text-center">
            How The Magic Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 font-body">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">1</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Select Design</h4>
              <p className="text-xs text-brandText-muted">Choose your preferred royal, Vedic, or modern video theme.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">2</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Share Wedding Info</h4>
              <p className="text-xs text-brandText-muted">Submit wedding dates, ceremonies, couple names, and photos.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">3</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Motion Crafting</h4>
              <p className="text-xs text-brandText-muted">Our motion artists render your personalized 4K cinema video in 24 hours.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">4</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Share on WhatsApp</h4>
              <p className="text-xs text-brandText-muted">Send your stunning video invite effortlessly to all your guests.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
