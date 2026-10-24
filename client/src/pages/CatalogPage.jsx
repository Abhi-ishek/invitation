import React from 'react';
import { useFilterStore } from '../store/useFilterStore';
import { useVideos } from '../hooks/useVideos';
import VideoCard from '../components/VideoCard';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Royal Palace',
  'Traditional Vedic',
  'Floral Bloom',
  'Destination & Beach',
  'Modern Minimalist',
  'Animated Caricature',
];

export default function CatalogPage() {
  const {
    selectedCategory,
    searchQuery,
    sortBy,
    setCategory,
    setSearchQuery,
    setSortBy,
  } = useFilterStore();

  const { videos, loading } = useVideos(selectedCategory, searchQuery, sortBy);

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-gold-dark font-bold">
            The Complete Atelier
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-maroon mt-1">
            Wedding Invitation Video Catalog
          </h1>
          <p className="text-sm text-brandText-muted mt-2">
            Explore our handcrafted video designs. Filter by theme, search keywords, or sort by pricing.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gold/20 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
              <input
                type="text"
                placeholder="Search by theme, palace, floral..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 bg-cream-50 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-brandText"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-brandText-light" />
              <span className="text-xs text-brandText-muted whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2 px-3 rounded-xl border border-gold/30 bg-cream-50 text-xs font-medium text-brandText focus:outline-none focus:border-gold"
              >
                <option value="featured">Featured & Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Categories Pill list */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gold/15">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-maroon text-gold-light shadow-sm'
                    : 'bg-cream-100 hover:bg-cream-200 text-brandText'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-white/60 p-4 animate-pulse border border-gold/20 h-96" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gold/20">
            <Sparkles className="w-12 h-12 text-gold-dark mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-maroon">No invitation templates matched</h3>
            <p className="text-xs text-brandText-muted mt-1">Try resetting your search query or selecting another theme category.</p>
          </div>
        ) : (
          <div>
            <div className="text-xs text-brandText-muted mb-4 font-medium">
              Showing {videos.length} wedding video invitations
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
