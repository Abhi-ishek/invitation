import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import videoService from '../services/videoService';
import { Trash2, ArrowRight, Sparkles, Tag, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    clearCart,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await videoService.validateCoupon(couponCode.trim());
      applyCoupon(res.data);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center p-6">
        <div className="text-center max-w-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold/15 flex items-center justify-center text-gold-dark">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-maroon">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-brandText-muted">
            Explore our handcrafted video collections to begin your wedding invitation story.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-maroon text-gold-light font-bold text-xs uppercase tracking-wider shadow-md hover:bg-maroon-light transition-all"
          >
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brandText-muted hover:text-maroon transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? 'Design' : 'Designs'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map(({ product, customizationData }) => (
              <div
                key={product._id}
                className="p-4 sm:p-6 bg-white rounded-3xl border border-gold/25 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-20 h-28 object-cover rounded-xl border border-gold/20 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                      {product.category}
                    </span>
                    <h3 className="font-heading text-base sm:text-lg font-bold text-maroon">
                      {product.title}
                    </h3>
                    <p className="text-xs text-brandText-muted mt-0.5">
                      {customizationData.brideName && customizationData.groomName ? (
                        <span className="text-maroon font-medium">
                          Couple: {customizationData.brideName} & {customizationData.groomName}
                        </span>
                      ) : (
                        <span>Customization details included</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-heading text-lg font-bold text-maroon">
                        ₹{product.price?.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-brandText-light line-through">
                          ₹{product.originalPrice?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-0 border-gold/15">
                  <button
                    onClick={() => removeItem(product._id)}
                    className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Express 24h Delivery
                  </span>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-xs text-brandText-muted hover:text-rose-600"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Coupon Box */}
            <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-3">
              <h4 className="font-heading text-sm font-bold text-maroon flex items-center gap-2">
                <Tag className="w-4 h-4 text-gold-dark" />
                Have a Coupon Code?
              </h4>

              {coupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800">{coupon.code}</span>
                    <span className="text-emerald-700 block text-[11px]">{coupon.discountPercent}% Discount Applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gold/30 text-xs uppercase bg-cream-50 focus:outline-none focus:border-gold"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 rounded-xl bg-maroon text-gold-light text-xs font-bold hover:bg-maroon-light transition-all disabled:opacity-50"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
                  <p className="text-[10px] text-brandText-muted">
                    Tip: Use coupon <span className="font-bold text-maroon">WELCOME10</span> for 10% off your first order!
                  </p>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-4">
              <h4 className="font-heading text-lg font-bold text-maroon">Order Summary</h4>
              
              <div className="space-y-2 text-xs text-brandText-muted">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-brandText">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promo Discount ({coupon.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>4K Render & WhatsApp Delivery</span>
                  <span className="text-emerald-700 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-base font-bold text-maroon font-heading pt-3 border-t border-gold/15">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-brandText-muted pt-2 border-t border-gold/15">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Instant UPI QR Payment (GPay, PhonePe, Paytm, BHIM)</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
