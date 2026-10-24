import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, ArrowRight, Sparkles, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import videoService from '../services/videoService';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
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
      setCouponError(err.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-maroon-dark/70 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-cream-50 border-l border-gold/30 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-royal-gradient text-cream border-b border-gold/25 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold animate-spin" />
                  <h2 className="font-heading text-lg font-bold text-cream">
                    Your Wishcraft Cart ({items.length})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1 rounded-full text-cream/70 hover:text-cream hover:bg-maroon-light transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {items.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center text-gold-dark">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="font-heading text-lg font-bold text-maroon">
                      Your invitation box is empty
                    </p>
                    <p className="text-xs text-brandText-muted max-w-xs mx-auto">
                      Explore our hand-crafted royal and 3D AI wedding invitation videos to begin.
                    </p>
                    <button
                      onClick={() => { closeCart(); navigate('/shop'); }}
                      className="mt-3 px-6 py-2.5 rounded-full bg-maroon text-gold-light text-xs font-bold uppercase tracking-wider"
                    >
                      Browse Themes
                    </button>
                  </div>
                ) : (
                  items.map(({ product, customizationData }) => (
                    <div
                      key={product._id}
                      className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-gold/20 shadow-sm items-center justify-between"
                    >
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        className="w-16 h-20 object-cover rounded-xl border border-gold/20 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase font-bold text-gold-dark tracking-wider">
                          {product.category}
                        </span>
                        <h4 className="font-heading text-xs sm:text-sm font-bold text-maroon truncate">
                          {product.title}
                        </h4>
                        <p className="text-[10px] text-brandText-muted truncate mt-0.5">
                          {customizationData.brideName && customizationData.groomName
                            ? `${customizationData.brideName} & ${customizationData.groomName}`
                            : 'Personalization included'}
                        </p>
                        <p className="text-xs text-maroon font-bold mt-1">
                          ₹{product.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(product._id)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Coupon Input & Checkout Footer */}
              {items.length > 0 && (
                <div className="p-5 bg-white border-t border-gold/20 space-y-3.5">
                  {/* Coupon section */}
                  {coupon ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-emerald-800">{coupon.code}</span>
                        <span className="text-emerald-700 block text-[10px]">{coupon.discountPercent}% Discount Applied!</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-[10px] font-bold text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon: WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl border border-gold/30 text-xs uppercase bg-cream-50 focus:outline-none focus:border-gold"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading}
                        className="px-3.5 py-1.5 rounded-xl bg-maroon text-gold-light text-xs font-bold hover:bg-maroon-light transition-all disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && <p className="text-[10px] text-rose-600">{couponError}</p>}

                  {/* Summary */}
                  <div className="space-y-1.5 text-xs text-brandText-muted">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-brandText">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Discount ({coupon.code})</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-maroon font-heading pt-2 border-t border-gold/15">
                      <span>Total Amount</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-lg flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-brandText-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>24h Turnaround • Unlimited Revisions</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
