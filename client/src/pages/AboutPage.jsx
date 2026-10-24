import React from 'react';
import { Sparkles, Heart, Film, Users, ShieldCheck, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
            Our Heritage & Passion
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-maroon">
            About Wedding Wishcraft
          </h1>
          <p className="text-brandText-muted text-sm sm:text-base max-w-2xl mx-auto">
            We are a creative atelier of motion artists, illustrators, and sound designers dedicated 
            to crafting the most enchanting wedding invitation videos in India and across the globe.
          </p>
        </div>

        {/* 4 Steps Process */}
        <div className="bg-white p-8 rounded-3xl border border-gold/20 shadow-sm space-y-6">
          <h2 className="font-heading text-2xl font-bold text-maroon text-center">
            How The Magic Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">1</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Select Design</h4>
              <p className="text-xs text-brandText-muted">Choose your preferred royal, vedic, or modern video theme.</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-maroon text-gold font-bold flex items-center justify-center mx-auto">2</div>
              <h4 className="font-heading font-bold text-maroon text-sm">Share Wedding Info</h4>
              <p className="text-xs text-brandText-muted">Submit your wedding dates, ceremonies, couple names, and photos.</p>
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

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-cream-50 border border-gold/20 space-y-2">
            <Film className="w-6 h-6 text-gold-dark" />
            <h3 className="font-heading font-bold text-maroon">Cinema Quality 4K</h3>
            <p className="text-xs text-brandText-muted">Every scene is rendered in crisp 60fps high definition with rich royal color grading.</p>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-gold/20 space-y-2">
            <Clock className="w-6 h-6 text-gold-dark" />
            <h3 className="font-heading font-bold text-maroon">Swift Turnaround</h3>
            <p className="text-xs text-brandText-muted">We respect your wedding timeline; previews are sent within 24 hours.</p>
          </div>
          <div className="p-6 rounded-2xl bg-cream-50 border border-gold/20 space-y-2">
            <Heart className="w-6 h-6 text-gold-dark" />
            <h3 className="font-heading font-bold text-maroon">Crafted With Care</h3>
            <p className="text-xs text-brandText-muted">We cherish each couple's sacred traditions and cultural heritage.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
