import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import SampleVideoModal from './SampleVideoModal';

export default function VideoCard({ video }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const { items, addItem } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();

  const currentVideoId = String(video?._id || video?.id || '');
  const isInCart = Boolean(currentVideoId) && items.some((item) => {
    const itemProdId = String(item?.product?._id || item?.product?.id || item?.product || '');
    return Boolean(itemProdId) && itemProdId === currentVideoId;
  });

  const isWishlisted = Boolean(currentVideoId) && user?.wishlist?.some((w) => {
    const wishlistId = String(typeof w === 'string' ? w : w?._id || w?.id || '');
    return Boolean(wishlistId) && wishlistId === currentVideoId;
  });

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save templates to your Wishlist!');
      return;
    }
    await toggleWishlist(video._id || video.id);
  };

  const discountPercent =
    video.discountPercent ||
    (video.originalPrice && video.originalPrice > video.price
      ? Math.round(((video.originalPrice - video.price) / video.originalPrice) * 100)
      : 0);

  // Format tags as "Tag1 | Tag2 | Tag3" if array
  const formattedTags = Array.isArray(video.tags)
    ? video.tags.join(' | ')
    : video.tags || 'Modern | Royal | Cinematic';

  const productUrl = `/product/${video.slug || video._id || video.id}`;

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl overflow-hidden border border-[#edd7c2] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg hover:border-[#d4a85a] flex flex-col justify-between transition-all duration-300"
      >
        {/* Top Thumbnail Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#24060e] group">
          {/* Shimmer skeleton while image loads */}
          {!imgLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#24060e] via-[#3a0d19] to-[#24060e] animate-pulse" />
          )}

          <Link to={productUrl} className="block w-full h-full cursor-pointer">
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </Link>

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />

          {/* Top Left Badge (Bestseller in amber, New in green) */}
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            {video.badge === 'New' ? (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-[#1fa45c] rounded-full shadow-sm tracking-wide">
                New
              </span>
            ) : (
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-white bg-[#c9893d] rounded-full shadow-sm tracking-wide">
                Bestseller
              </span>
            )}
          </div>

          {/* Top Right Wishlist Heart Circle */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-white text-white hover:text-rose-600 flex items-center justify-center backdrop-blur-sm transition-all shadow-sm z-10"
            title="Save to Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>

          {/* Left/Center Translucent Play Button Overlay */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setModalOpen(true);
            }}
            className="absolute bottom-2.5 left-2.5 w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 border border-white/60 text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-md z-10"
            title="Watch 4K Preview"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-3.5 flex flex-col flex-grow justify-between text-left">
          {/* Title */}
          <div>
            <Link to={productUrl} className="block group/title">
              <h3 className="font-heading text-sm font-bold text-[#2a0812] group-hover/title:text-[#9a6428] line-clamp-1 leading-snug transition-colors">
                {video.title}
              </h3>
            </Link>

            {/* Sub-tags */}
            <p className="text-[11px] text-gray-500 font-body mt-0.5 line-clamp-1">
              {formattedTags}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 text-xs mt-1.5 font-body">
              <span className="text-[#c9893d] font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#c9893d] text-[#c9893d]" />
                {video.rating || 4.8}
              </span>
              <span className="text-gray-400 text-[11px]">
                ({video.numReviews || 120})
              </span>
            </div>

            {/* Pricing Row */}
            <div className="flex items-baseline gap-2 mt-2 font-body">
              <span className="text-sm font-bold text-[#2a0812]">
                ₹ {video.price?.toLocaleString('en-IN')}
              </span>
              {video.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ₹ {video.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-[#b55816]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Full-Width Dark Maroon Pill Button: Add to Cart */}
          <div className="mt-3 pt-1">
            <button
              onClick={() => addItem(video)}
              className={`w-full py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 font-body ${
                isInCart
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#320b17] hover:bg-[#471122] text-white'
              }`}
            >
              {isInCart ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Video Modal with lazy loading & poster */}
      <SampleVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl={video.previewVideo}
        poster={video.thumbnail}
        title={video.title}
      />
    </>
  );
}
