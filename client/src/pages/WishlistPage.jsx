import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import VideoCard from '../components/VideoCard';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const wishlist = user?.wishlist || [];

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            Saved Atelier Favorites
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-1">
            My Wedding Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted mt-2">
            Designs you have saved while browsing for your dream wedding celebration.
          </p>
        </div>

        {!user ? (
          <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-gold/25 shadow-sm text-center space-y-4">
            <Heart className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-heading text-xl font-bold text-maroon">Sign in to View Wishlist</h3>
            <p className="text-xs text-brandText-muted">
              Log in to sync your saved wedding video designs across all devices.
            </p>
            <Link
              to="/login"
              className="inline-block px-6 py-3 rounded-full bg-maroon text-gold-light text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Sign In Now
            </Link>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="max-w-md mx-auto p-12 rounded-3xl bg-white border border-gold/25 text-center space-y-4">
            <Sparkles className="w-10 h-10 text-gold mx-auto" />
            <h3 className="font-heading text-xl font-bold text-maroon">No saved invitations yet</h3>
            <p className="text-xs text-brandText-muted">
              Browse our royal traditional, 3D AI, and caricature videos and click the heart icon to save your favorites.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-maroon text-gold-light text-xs font-bold uppercase tracking-wider"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {wishlist.map((item) => (
              <VideoCard key={item._id || item} video={item} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
