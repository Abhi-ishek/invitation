import React, { useState } from 'react';
import { Heart, ShoppingBag, CheckCircle2, Play, Home, Store, User } from 'lucide-react';
import SampleVideoModal from './SampleVideoModal';

export default function HowItWorks() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cartQty, setCartQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  return (
    <>
      <section className="py-10 sm:py-14 bg-[#faf6f0] border-t border-[#ebd8c5]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-7 items-start">
            
            {/* Column 1: 1. Add to Cart */}
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2c0813]">
                  1. Add to Cart
                </h3>
                <p className="text-[11px] text-gray-500 font-body">
                  Select your favourite invitation and add to cart.
                </p>
              </div>

              {/* Mini Product Card Preview */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#edd7c2] shadow-sm space-y-3">
                <div className="flex gap-3 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80"
                    alt="Royal 3D AI Wedding Invitation"
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#2c0813] font-heading truncate">
                        Royal 3D AI Wedding Invitation
                      </h4>
                      <Heart className="w-3.5 h-3.5 text-gray-400 hover:text-rose-500 cursor-pointer flex-shrink-0" />
                    </div>
                    <span className="text-xs font-bold text-[#2c0813] block mt-1 font-body">
                      ₹ 1,499
                    </span>
                  </div>
                </div>

                {/* Counter & Add to Cart button */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center border border-[#edd7c2] rounded-full px-2 py-0.5 text-xs text-gray-700 font-body">
                    <button
                      onClick={() => setCartQty((q) => Math.max(1, q - 1))}
                      className="px-1.5 py-0.5 hover:text-[#2c0813] font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 font-semibold text-[11px]">{cartQty}</span>
                    <button
                      onClick={() => setCartQty((q) => q + 1)}
                      className="px-1.5 py-0.5 hover:text-[#2c0813] font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex-1 py-1.5 px-3 rounded-full bg-[#320b17] hover:bg-[#471122] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all font-body shadow-sm"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Column 2: 2. Checkout */}
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2c0813]">
                  2. Checkout
                </h3>
                <p className="text-[11px] text-gray-500 font-body">
                  Enter your details and choose payment method.
                </p>
              </div>

              {/* Checkout Mini Form */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#edd7c2] shadow-sm space-y-2.5">
                <span className="text-[11px] font-bold text-[#2c0813] block font-heading">
                  Delivery Details
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    defaultValue="Aarav Sharma"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-body bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4a85a]"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    defaultValue="+91 9876543210"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-body bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4a85a]"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Wedding Date"
                    defaultValue="14 Dec 2026"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-[11px] font-body bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#d4a85a]"
                  />
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-[#2c0813] block font-heading mb-1.5">
                    Payment Method
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-body text-gray-700">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-[#320b17]"
                      />
                      <span>UPI / PhonePe / GPay</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-[#320b17]"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-[#320b17]"
                      />
                      <span>Cards</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'net'}
                        onChange={() => setPaymentMethod('net')}
                        className="accent-[#320b17]"
                      />
                      <span>Net Banking</span>
                    </label>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    className="w-full py-2 rounded-full bg-[#320b17] hover:bg-[#471122] text-white text-xs font-semibold shadow-sm transition-all font-body text-center"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: 3. Track Your Order */}
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2c0813]">
                  3. Track Your Order
                </h3>
                <p className="text-[11px] text-gray-500 font-body">
                  Check your order status in real-time.
                </p>
              </div>

              {/* Order Status Card with Stepper & Video Box */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#edd7c2] shadow-sm">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                  <div>
                    <h5 className="text-[11px] font-bold text-[#2c0813] font-body">
                      Order #WW12345
                    </h5>
                    <span className="text-[9px] text-gray-400 block font-body">
                      Placed on 12 Apr 2025
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* Left Stepper */}
                  <div className="col-span-7 space-y-2 text-[10px] font-body">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800 block leading-tight">Order Placed</span>
                        <span className="text-[8px] text-gray-400">12 Apr 2025, 10:30 AM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-800 block leading-tight">In Production</span>
                        <span className="text-[8px] text-gray-400">13 Apr 2025, 11:20 AM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700 block leading-tight">Preview Ready</span>
                        <span className="text-[8px] text-gray-400">14 Apr 2025, 4:45 PM</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 opacity-60">
                      <div className="w-3.5 h-3.5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-[8px] flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600 block leading-tight">Completed</span>
                        <span className="text-[8px] text-gray-400">Will be delivered soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Video Preview Box */}
                  <div className="col-span-5 flex flex-col items-center text-center space-y-1.5 bg-[#fbf7f2] p-2 rounded-xl border border-[#edd7c2]">
                    <div
                      onClick={() => setModalOpen(true)}
                      className="relative w-full aspect-video rounded-lg overflow-hidden bg-black cursor-pointer group shadow-sm"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80"
                        alt="Video Preview"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 text-[#2c0813] flex items-center justify-center shadow">
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <span className="text-[8px] text-gray-500 leading-tight block font-body">
                      Your invitation is ready! Click to watch preview.
                    </span>
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="w-full py-1 rounded-full bg-[#320b17] hover:bg-[#471122] text-white text-[9px] font-semibold transition-all font-body shadow-sm"
                    >
                      Download Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 4: Mobile Responsive Mockup Phone */}
            <div className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-bold text-[#2c0813]">
                  Mobile Responsive
                </h3>
                <p className="text-[11px] text-gray-500 font-body">
                  Shop anytime, anywhere.
                </p>
              </div>

              {/* Realistic Smartphone Mockup */}
              <div className="flex justify-center">
                <div className="w-[180px] h-[310px] bg-black rounded-[28px] p-2 shadow-xl border-4 border-gray-800 flex flex-col relative overflow-hidden">
                  {/* Phone Notch/Speaker */}
                  <div className="w-16 h-3 bg-gray-800 rounded-full mx-auto mb-1.5 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mr-2" />
                    <div className="w-5 h-1 bg-gray-900 rounded-full" />
                  </div>

                  {/* Phone Screen Display */}
                  <div className="flex-1 bg-[#25070f] rounded-[18px] overflow-hidden flex flex-col justify-between text-white text-[8px] p-2 relative">
                    {/* Mini Header */}
                    <div className="flex items-center justify-between border-b border-gold/20 pb-1">
                      <div className="flex items-center gap-1">
                        <div className="w-3.5 h-3.5 rounded-full border border-gold/40 flex items-center justify-center bg-[#320a16]">
                          <span className="text-[6px] text-gold font-bold">W</span>
                        </div>
                        <span className="font-heading text-[8px] font-bold text-cream">Wedding Wishcraft</span>
                      </div>
                      <ShoppingBag className="w-2.5 h-2.5 text-cream" />
                    </div>

                    {/* Mini Hero Card with couple & Add to Cart */}
                    <div className="my-auto space-y-1 bg-[#1a040b] p-1.5 rounded-lg border border-gold/20 text-center">
                      <img
                        src="https://res.cloudinary.com/vrljkq9h/video/upload/c_scale,f_auto,q_auto,so_1,w_300/Sample_1.jpg"
                        alt="Mobile View"
                        className="w-full h-16 rounded object-cover"
                        loading="lazy"
                      />
                      <span className="font-bold text-[8px] text-cream block truncate">
                        Royal 3D AI Wedding Invitation
                      </span>
                      <span className="text-[7px] text-gold block">
                        ₹ 3,499
                      </span>
                      <button className="w-full py-0.5 rounded-full bg-[#320b17] text-white text-[7px] font-semibold border border-gold/30">
                        Add to Cart
                      </button>
                    </div>

                    {/* Bottom Mini Nav */}
                    <div className="flex items-center justify-around border-t border-gold/20 pt-1 text-[7px] text-cream/70">
                      <div className="flex flex-col items-center">
                        <Home className="w-2.5 h-2.5 text-gold" />
                        <span>Home</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Store className="w-2.5 h-2.5" />
                        <span>Shop</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span>Cart</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <User className="w-2.5 h-2.5" />
                        <span>Account</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Home Bar */}
                  <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mt-1" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Video Modal Trigger */}
      <SampleVideoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        videoUrl="https://res.cloudinary.com/vrljkq9h/video/upload/q_auto,vc_auto/Sample_1.mp4"
        title="Order #WW12345 — Royal 3D AI Invitation Preview"
      />
    </>
  );
}
