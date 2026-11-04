import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import videoService from '../services/videoService';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import VideoCard from '../components/VideoCard';
import {
  Sparkles,
  Play,
  Pause,
  Clock,
  Star,
  Music,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Volume2,
  Heart,
  MessageSquare,
  Upload,
  Calendar,
} from 'lucide-react';

export default function ProductDetailPage() {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Customization Form State
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venue, setVenue] = useState('');
  const [language, setLanguage] = useState('English & Hindi');
  const [musicChoice, setMusicChoice] = useState('Default Shehnai & Sitar Blend');
  const [notes, setNotes] = useState('');

  // Review modal state
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { items, addItem } = useCartStore();
  const { user, toggleWishlist } = useAuthStore();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await videoService.getProductByIdentifier(identifier);
        setProduct(res.data.product);
        setRelated(res.data.related || []);

        // fetch reviews
        const reviewRes = await videoService.getReviews(res.data.product._id);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gold border-t-maroon rounded-full animate-spin mx-auto" />
          <p className="font-heading text-lg text-maroon">Loading bespoke invitation video...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="font-heading text-2xl text-maroon">Design Not Found</h2>
          <Link to="/shop" className="text-gold-dark underline mt-4 inline-block text-sm">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  const currentProductId = String(product?._id || product?.id || '');
  const isInCart = Boolean(currentProductId) && items.some((item) => {
    const itemProdId = String(item?.product?._id || item?.product?.id || '');
    return Boolean(itemProdId) && itemProdId === currentProductId;
  });
  const isWishlisted = Boolean(currentProductId) && user?.wishlist?.some((w) => {
    const wishlistId = String(typeof w === 'string' ? w : w?._id || w?.id || '');
    return Boolean(wishlistId) && wishlistId === currentProductId;
  });

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please sign in or create an account to add items to your cart.',
        },
      });
      return;
    }
    addItem(product, {
      brideName,
      groomName,
      weddingDate,
      venue,
      language,
      musicChoice,
      notes,
    });
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login', {
        state: {
          from: location.pathname,
          message: 'Please sign in or create an account to purchase this invitation.',
        },
      });
      return;
    }
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      const res = await videoService.createReview({
        productId: product._id,
        name: reviewerName || user?.name || 'Happy Couple',
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviews([res.data, ...reviews]);
      setReviewOpen(false);
      setReviewComment('');
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    }
  };

  const discountPercent =
    product.discountPercent ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brandText-muted hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Invitations</span>
          </Link>

          <span className="text-xs text-gold-dark font-semibold">
            {product.category}
          </span>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: 9:16 Cinematic Video Player Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-2 border-gold/40 bg-black aspect-[9/16]">
              {isPlaying ? (
                <video
                  src={product.previewVideo}
                  poster={product.thumbnail}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-maroon-dark/40 flex flex-col items-center justify-center p-4">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-20 h-20 rounded-full bg-gold text-maroon flex items-center justify-center shadow-gold-glow hover:scale-110 transition-transform pl-1"
                      title="Play Preview"
                    >
                      <Play className="w-9 h-9 fill-current" />
                    </button>
                    <span className="text-cream text-xs font-bold tracking-widest uppercase mt-4 bg-maroon/90 px-4 py-1.5 rounded-full border border-gold/30">
                      Click to Play 4K Demo
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-brandText-muted">
              <Volume2 className="w-4 h-4 text-gold-dark" />
              <span>Full Shehnai & Sitar audio mastered in 4K</span>
            </div>
          </div>

          {/* Right Column: Title, Pricing & Customization Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-maroon/10 text-maroon border border-gold/30">
                  {product.category}
                </span>
                {product.badge && product.badge !== 'None' && (
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-3">
                {product.title}
              </h1>

              {/* Rating & meta */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-brandText-muted mt-2.5">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-brandText-light">({reviews.length || product.numReviews} reviews)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gold-dark" />
                  <span>{product.durationSeconds} Seconds</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4 text-gold-dark" />
                  <span>{product.musicTrack}</span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-white border border-gold/25 shadow-sm space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-heading text-3xl font-extrabold text-maroon">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-brandText-light line-through">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-brandText-muted leading-relaxed font-body">
                {product.description}
              </p>
            </div>

            {/* Customization Form */}
            <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <div className="flex items-center gap-2 text-maroon">
                  <Sparkles className="w-4 h-4 text-gold" />
                  <h3 className="font-heading text-base font-bold">Personalize Your Invitation</h3>
                </div>
                <span className="text-[11px] text-brandText-muted">Included with order</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-brandText mb-1">
                    Bride's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aditi Sharma"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brandText mb-1">
                    Groom's Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Kapoor"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-brandText">
                      Auspicious Wedding Date
                    </label>
                    {weddingDate && (
                      <span className="text-[10px] font-bold text-maroon bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30">
                        {weddingDate}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      onClick={(e) => {
                        if (typeof e.target.showPicker === 'function') {
                          e.target.showPicker();
                        }
                      }}
                      className="w-full pl-10 pr-3 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold cursor-pointer"
                    />
                    <Calendar className="w-4 h-4 text-gold-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brandText mb-1">
                    Wedding Venue & City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Oberoi Udaivilas, Udaipur"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brandText mb-1">
                    Language Selection
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  >
                    <option value="English & Hindi">English & Hindi Bilingual</option>
                    <option value="English Only">English Only</option>
                    <option value="Hindi & Sanskrit">Hindi & Sanskrit Mantras</option>
                    <option value="Tamil / Telugu">South Indian (Tamil / Telugu)</option>
                    <option value="Urdu & Arabic">Urdu & Arabic Nikah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brandText mb-1">
                    Music Preference
                  </label>
                  <select
                    value={musicChoice}
                    onChange={(e) => setMusicChoice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  >
                    <option value="Default Shehnai & Sitar Blend">Default Shehnai & Sitar Symphony</option>
                    <option value="Romantic Bollywood Flute">Romantic Bollywood Acoustic Flute</option>
                    <option value="Sacred Vedic Chants">Sacred Vedic Chants & Mantras</option>
                    <option value="Custom Song on WhatsApp">I will send my own song on WhatsApp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-brandText mb-1">
                  Family Names & Special Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="Include parents names, ceremony timeline (Mehendi, Sangeet), or specific requests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                    isInCart
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-maroon hover:bg-maroon-light text-gold-light border border-gold/40 shadow-sm'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isInCart ? 'Added to Cart (Open Cart)' : 'Add to Cart'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-gold-dark to-gold text-maroon hover:shadow-gold-glow hover:scale-105 transition-all shadow-md"
                >
                  Buy Now & Customize
                </button>
              </div>
            </div>

            {/* Features Checklist */}
            <div className="space-y-2 pt-2">
              <h4 className="font-heading text-sm font-bold text-maroon">What is included in this package:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features?.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-brandText bg-white p-2.5 rounded-xl border border-gold/15">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-gold/10 border border-gold/30 flex items-center gap-3 text-xs text-maroon">
              <ShieldCheck className="w-7 h-7 text-gold-dark flex-shrink-0" />
              <div>
                <p className="font-bold">100% Satisfaction Guarantee</p>
                <p className="text-[11px] text-brandText-muted">Free revisions on spelling, dates, music, and scene durations until you are delighted.</p>
              </div>
            </div>

          </div>

        </div>

        {/* Customer Reviews Section */}
        <section className="mt-16 sm:mt-24 pt-10 border-t border-gold/20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
                Real Love Stories
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-maroon mt-1">
                Customer Reviews ({reviews.length})
              </h3>
            </div>

            <button
              onClick={() => setReviewOpen(true)}
              className="px-4 py-2 rounded-full bg-maroon text-gold-light hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-gold/20">
              <p className="text-xs text-brandText-muted">Be the first happy couple to leave a review for this design!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-gold/20 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-maroon">{r.user?.name}</span>
                    <div className="flex text-amber-500">
                      {[...Array(r.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-brandText-muted italic">"{r.comment}"</p>
                  <span className="text-[10px] text-brandText-light block">{r.eventType}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 sm:mt-24 pt-10 border-t border-gold/20">
            <h3 className="font-heading text-2xl font-bold text-maroon mb-6 text-center sm:text-left">
              You May Also Adore
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((rel) => (
                <VideoCard key={rel._id} video={rel} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Review Modal */}
      {reviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-gold/30 shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-maroon">Share Your Experience</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aditi & Rohan"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:outline-none focus:border-gold"
                >
                  <option value={5}>5 Stars - Outstanding Experience</option>
                  <option value={4}>4 Stars - Great Invitation</option>
                  <option value={3}>3 Stars - Good</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Your Review</label>
                <textarea
                  rows="3"
                  placeholder="Tell us about the video quality, music, and how your guests reacted..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:outline-none focus:border-gold"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-maroon text-gold-light text-xs font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
