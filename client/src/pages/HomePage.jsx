import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ShopByCategory from '../components/ShopByCategory';
import VideoCard from '../components/VideoCard';
import PromoRow from '../components/PromoRow';
import videoService from '../services/videoService';
import { ArrowRight } from 'lucide-react';

const CLOUD_NAME = 'vrljkq9h';
const makeVideoUrl = (id) => `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto,vc_auto/${id}.mp4`;
const makeThumbUrl = (id, sec = 1) => `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/c_scale,f_auto,q_auto,so_${sec},w_600/${id}.jpg`;

// Curated Trending items powered by Cloudinary
const DEFAULT_TRENDING = [
  {
    _id: 'trending-1',
    id: 'trending-1',
    slug: '3d-hyper-real-royal-palace-ai-wedding-invitation',
    title: 'Royal 3D AI Wedding Invitation',
    tags: ['3D AI', 'Royal', 'Cinematic'],
    rating: 4.98,
    numReviews: 210,
    price: 3499,
    originalPrice: 6999,
    discountPercent: 50,
    badge: 'Bestseller',
    thumbnail: makeThumbUrl('Sample_1', 1),
    previewVideo: makeVideoUrl('Sample_1'),
  },
  {
    _id: 'trending-2',
    id: 'trending-2',
    slug: 'jodhpur-umaid-palace-heritage-rajputana-invite',
    title: 'Jodhpur Umaid Palace Heritage Invite',
    tags: ['Classic', 'Rajputana', 'Royal'],
    rating: 4.95,
    numReviews: 184,
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    badge: 'Bestseller',
    thumbnail: makeThumbUrl('Sample_2', 1),
    previewVideo: makeVideoUrl('Sample_2'),
  },
  {
    _id: 'trending-3',
    id: 'trending-3',
    slug: 'royal-golden-ring-ceremony-and-save-the-date',
    title: 'Royal Ring Ceremony & Save The Date',
    tags: ['Engagement', 'Rings', 'Save The Date'],
    rating: 4.94,
    numReviews: 160,
    price: 1499,
    originalPrice: 2999,
    discountPercent: 50,
    badge: 'New',
    thumbnail: makeThumbUrl('Engagement_Sample_1', 1),
    previewVideo: makeVideoUrl('Engagement_Sample_1'),
  },
  {
    _id: 'trending-4',
    id: 'trending-4',
    slug: '3d-celestial-royal-mandap-ai-celebration-film',
    title: '3D AI Celestial Mandap Celebration',
    tags: ['Luxury', 'Grand', 'Dreamy'],
    rating: 4.93,
    numReviews: 118,
    price: 3299,
    originalPrice: 6499,
    discountPercent: 49,
    badge: 'Bestseller',
    thumbnail: makeThumbUrl('Sample_6', 1),
    previewVideo: makeVideoUrl('Sample_6'),
  },
  {
    _id: 'trending-5',
    id: 'trending-5',
    slug: 'editorial-noir-and-champagne-velvet-e-invite',
    title: 'Minimal & Modern Velvet E-Invite',
    tags: ['Elegant', 'Simple', 'Classy'],
    rating: 4.89,
    numReviews: 104,
    price: 1899,
    originalPrice: 3799,
    discountPercent: 50,
    badge: 'New',
    thumbnail: makeThumbUrl('Sample_7', 1),
    previewVideo: makeVideoUrl('Sample_7'),
  },
  {
    _id: 'trending-6',
    id: 'trending-6',
    slug: 'udaipur-lake-palace-golden-shimmer-invite',
    title: 'Udaipur Lake Palace Shimmer Invite',
    tags: ['Traditional', 'Rich', 'Grand'],
    rating: 4.97,
    numReviews: 156,
    price: 2699,
    originalPrice: 5299,
    discountPercent: 49,
    badge: 'Bestseller',
    thumbnail: makeThumbUrl('Sample_8', 1),
    previewVideo: makeVideoUrl('Sample_8'),
  },
];

export default function HomePage() {
  const [trendingVideos, setTrendingVideos] = useState(DEFAULT_TRENDING);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await videoService.getTrending();
        const list = res.data?.trending || (Array.isArray(res.data) ? res.data : []);
        if (list && list.length >= 6) {
          setTrendingVideos(list.slice(0, 6));
        } else if (list && list.length > 0) {
          setTrendingVideos(list);
        }
      } catch (err) {
        console.log('Using default curated trending videos');
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Shop By Category Strip */}
      <ShopByCategory />

      {/* 3. Trending Invitations Section */}
      <section className="py-8 sm:py-10 bg-[#faf6f0]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with "View All →" */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark block mb-0.5">
                Curated Royal Collection
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-maroon leading-tight">
                Trending Invitations
              </h2>
              <p className="text-xs text-brandText-muted font-body mt-0.5">
                Most loved bespoke invitation designs by our couples
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cream-50 hover:bg-gold/15 border border-gold/30 text-xs font-semibold text-maroon hover:text-maroon transition-all group font-body shadow-sm"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-gold-dark" />
            </Link>
          </div>

          {/* 6 Product Cards in a Single Row on Large Screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
            {trendingVideos.map((video) => (
              <VideoCard key={video._id || video.id} video={video} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Three-Column Promo Row (Special Offer, Why Choose Us, Follow Us on Instagram) */}
      <PromoRow />

    </div>
  );
}
