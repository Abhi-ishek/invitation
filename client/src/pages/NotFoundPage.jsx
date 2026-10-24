import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center p-6">
      <div className="text-center space-y-4 max-w-md">
        <Sparkles className="w-12 h-12 text-gold-dark mx-auto animate-bounce" />
        <h1 className="font-heading text-4xl font-bold text-maroon">404 - Page Not Found</h1>
        <p className="text-xs sm:text-sm text-brandText-muted">
          The page you are seeking does not exist or has moved into another celebration hall.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-maroon text-gold-light hover:text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
