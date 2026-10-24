import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import { Film, Activity, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      videoService
        .getMyOrders()
        .then((res) => setOrders(res.data || []))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gold/25 text-center space-y-4">
          <Film className="w-12 h-12 text-gold mx-auto" />
          <h2 className="font-heading text-2xl font-bold text-maroon">View Your Orders</h2>
          <p className="text-xs text-brandText-muted">Please sign in to view your orders and track video rendering.</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 rounded-full bg-maroon text-gold-light text-xs font-bold uppercase tracking-wider"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark">
            Order Archive
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-1">
            My Wedding Orders
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted mt-1">
            Track your personalized invitation videos, view production timelines, and download final files.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-brandText-muted">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-gold/25 text-center space-y-4">
            <Film className="w-12 h-12 text-gold mx-auto" />
            <h3 className="font-heading text-xl font-bold text-maroon">No Orders Placed Yet</h3>
            <p className="text-xs text-brandText-muted max-w-sm mx-auto">
              You haven't ordered any wedding invitation video templates yet. Explore our royal collections to get started!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-maroon text-gold-light text-xs font-bold uppercase tracking-wider"
            >
              <span>Browse Designs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="p-6 bg-white rounded-3xl border border-gold/25 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-xl font-bold text-maroon">
                      {ord.orderNumber}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gold text-maroon">
                      {ord.orderStatus}
                    </span>
                  </div>

                  <p className="text-xs text-brandText-muted">
                    Placed on: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  <div className="text-xs text-brandText">
                    {ord.items?.length} Video Template(s) • Total: <span className="font-bold text-maroon">₹{ord.totalAmount?.toLocaleString('en-IN')}</span> ({ord.paymentMethod})
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    to={`/track/${encodeURIComponent(ord.orderNumber)}`}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-maroon text-gold-light hover:bg-maroon-light text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Track Status</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
