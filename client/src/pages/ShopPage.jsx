import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import videoService from '../services/videoService';
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  '3D AI Invitation',
  'Royal Traditional',
  'Caricature & Save The Date',
  'Minimal & Modern',
  'Muslim Invitations',
  'South Indian',
  'Custom Designs',
];

const BADGES = ['All', 'Bestseller', 'New', 'Trending'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [badge, setBadge] = useState('All');
  const [sort, setSort] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(7000);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) setCategory(urlCategory);
    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearch(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await videoService.getProducts({
          category: category !== 'All' ? category : undefined,
          search: search || undefined,
          badge: badge !== 'All' ? badge : undefined,
          maxPrice: maxPrice < 7000 ? maxPrice : undefined,
          sort,
          limit: 100,
        });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 250);
    return () => clearTimeout(timer);
  }, [category, search, badge, sort, maxPrice]);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Atelier
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-maroon mt-1">
            Shop Wedding Invitation Videos
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted mt-2 font-body">
            Browse our entire collection of 4K cinematic video invitations. Filter by aesthetic, budget, or theme.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gold/25 shadow-sm mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
              <input
                type="text"
                placeholder="Search by keywords, tags, palace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gold/30 bg-cream-50 text-xs sm:text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-brandText"
              />
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gold/30 bg-cream-50 text-xs font-semibold text-maroon"
              >
                <Filter className="w-3.5 h-3.5" /> Filter
              </button>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-brandText-light" />
                <span className="text-xs text-brandText-muted whitespace-nowrap">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="py-2 px-3 rounded-xl border border-gold/30 bg-cream-50 text-xs font-semibold text-brandText focus:outline-none focus:border-gold"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">New Arrivals</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gold/15">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSearchParams(cat !== 'All' ? { category: cat } : {});
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-maroon text-gold-light shadow-sm border border-gold/40'
                    : 'bg-cream-100 hover:bg-cream-200 text-brandText border border-gold/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Secondary Badge Pills & Max Price */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-brandText-muted">Badge:</span>
              {BADGES.map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(b)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    badge === b
                      ? 'bg-gold text-maroon shadow-sm'
                      : 'bg-cream-50 text-brandText-muted hover:text-maroon'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-brandText-muted">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input
                type="range"
                min="1999"
                max="7000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-maroon cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Video Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="rounded-2xl bg-white p-4 animate-pulse border border-gold/20 h-96" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gold/20">
            <Sparkles className="w-12 h-12 text-gold mx-auto mb-3" />
            <h3 className="font-heading text-xl font-bold text-maroon">No invitation templates found</h3>
            <p className="text-xs text-brandText-muted mt-1">Try relaxing your search terms or price filter.</p>
            <button
              onClick={() => {
                setCategory('All');
                setSearch('');
                setBadge('All');
                setMaxPrice(7000);
              }}
              className="mt-4 px-4 py-2 rounded-full bg-maroon text-gold-light text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="text-xs text-brandText-muted mb-4 font-medium flex items-center justify-between">
              <span>Showing {products.length} invitation video templates</span>
              {category !== 'All' && (
                <span className="text-gold-dark font-bold">Category: {category}</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.map((product) => (
                <VideoCard key={product._id} video={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
