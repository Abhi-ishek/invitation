import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { videoService } from '../services/videoService';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { Sparkles, Play, Clock, Star, Music, CheckCircle2, ArrowLeft, ShieldCheck, ShoppingBag } from 'lucide-react';

export default function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { items, addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      try {
        const res = await videoService.getVideoById(id);
        setVideo(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-maroon rounded-full animate-spin mx-auto" />
          <p className="font-heading text-lg text-maroon">Loading bespoke invitation preview...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-maroon">Template Not Found</h2>
          <Link to="/catalog" className="text-gold-dark underline mt-4 inline-block text-sm">
            Back to Video Catalog
          </Link>
        </div>
      </div>
    );
  }

  const currentVideoId = String(video?._id || video?.id || '');
  const isInCart = Boolean(currentVideoId) && items.some((item) => {
    const itemProdId = String(item?.product?._id || item?.product?.id || item?.video?._id || '');
    return Boolean(itemProdId) && itemProdId === currentVideoId;
  });

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brandText-muted hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Collections</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: 9:16 Video Player Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-gold/40 bg-black aspect-[9/16]">
              {isPlaying ? (
                <video
                  src={video.previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-20 h-20 rounded-full bg-gold text-maroon flex items-center justify-center shadow-gold-glow hover:scale-110 transition-transform pl-1"
                    >
                      <Play className="w-9 h-9 fill-current" />
                    </button>
                    <span className="text-cream text-xs font-semibold tracking-wider uppercase mt-4 bg-black/60 px-3 py-1 rounded-full">
                      Click to Play 4K Demo
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Video Details & Customization Options */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-maroon/10 text-maroon border border-gold/30">
                {video.category}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-3">
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-brandText-muted mt-3">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{video.rating}</span>
                  <span className="text-brandText-light">({video.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gold-dark" />
                  <span>{video.durationSeconds} Seconds</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4 text-gold-dark" />
                  <span>{video.musicTrack}</span>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-brandText-muted leading-relaxed font-body">
              {video.description}
            </p>

            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-white border border-gold/30 shadow-sm space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-extrabold text-maroon">
                  ₹{video.price?.toLocaleString('en-IN')}
                </span>
                {video.originalPrice && (
                  <span className="text-sm text-brandText-light line-through">
                    ₹{video.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Limited Festive Offer
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-brandText-muted pt-2 border-t border-gold/15">
                <div>
                  <span className="text-brandText-light block text-[10px] uppercase">Format</span>
                  <span className="font-semibold text-brandText">9:16 WhatsApp Story & Reels</span>
                </div>
                <div>
                  <span className="text-brandText-light block text-[10px] uppercase">Delivery Speed</span>
                  <span className="font-semibold text-emerald-700">{video.deliveryHours || 24} Hours Express</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login', {
                      state: {
                        from: location.pathname,
                        message: 'Please sign in or create an account to select this video invitation.',
                      },
                    });
                    return;
                  }
                  addItem(video);
                }}
                className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-300 ${
                  isInCart
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-royal-gradient text-gold-light hover:text-white shadow-luxury hover:shadow-gold-glow'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isInCart ? 'Added to Cart (Open Cart)' : 'Select & Customize This Video'}</span>
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3">
              <h3 className="font-heading text-lg font-bold text-maroon">Included in this Package:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {video.features?.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-brandText bg-white/70 p-2.5 rounded-lg border border-gold/15">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Banner */}
            <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 flex items-center gap-3 text-xs text-maroon">
              <ShieldCheck className="w-6 h-6 text-gold-dark flex-shrink-0" />
              <div>
                <p className="font-bold">Wishcraft Promise</p>
                <p className="text-[11px] text-brandText-muted">Free revisions of text, dates, music, and venues until you are completely satisfied.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
