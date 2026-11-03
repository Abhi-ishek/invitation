import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Banknote, Smartphone, Lock, QrCode, X, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, coupon, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [weddingDate, setWeddingDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UPI QR Modal State
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  if (items.length === 0) {
    navigate('/shop');
    return null;
  }

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4A85A', '#E8C887', '#3A0A1E', '#5A1030'],
      });
    } catch (err) {}
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email, and WhatsApp mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product._id,
          customizationData: item.customizationData,
        })),
        customerDetails: {
          name,
          email,
          phone,
          weddingDate,
        },
        paymentMethod: paymentMethod === 'COD' ? 'COD' : paymentMethod === 'UPI' ? 'UPI' : 'Razorpay',
        couponCode: coupon?.code,
      };

      const res = await videoService.createOrder(orderPayload);
      const createdOrder = res.data;

      // If UPI selected, show QR code modal
      if (paymentMethod === 'UPI') {
        try {
          const qrRes = await videoService.generateUpiQr({
            orderId: createdOrder._id,
            amount: total,
            customerName: name,
          });
          setQrData({
            ...qrRes.data,
            orderId: createdOrder._id,
            orderNumber: createdOrder.orderNumber,
          });
          setShowQrModal(true);
          setLoading(false);
          return;
        } catch (qrErr) {
          console.error('QR generation failed:', qrErr);
        }
      }

      // For Cards/COD or if QR failed
      fireConfetti();
      clearCart();
      navigate(`/order-success/${encodeURIComponent(createdOrder.orderNumber)}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpiPayment = async () => {
    if (!qrData) return;

    const trimmedRef = upiRefInput.trim();
    if (!trimmedRef || trimmedRef.length < 6) {
      setError('Please enter the 12-digit UPI Reference (UTR) number or Transaction ID from your UPI app receipt.');
      return;
    }

    setConfirmingPayment(true);
    setError('');

    try {
      await videoService.confirmUpiPayment({
        orderId: qrData.orderId,
        paymentId: qrData.paymentId,
        upiTransactionRef: trimmedRef,
      });

      setShowQrModal(false);
      fireConfetti();
      clearCart();
      navigate(`/order-success/${encodeURIComponent(qrData.orderNumber)}`);
    } catch (err) {
      setError(err.message || 'Payment confirmation failed. Please check the UTR or contact support.');
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleCopyUpi = () => {
    if (qrData?.upiId) {
      navigator.clipboard.writeText(qrData.upiId).catch(() => {});
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mb-2 text-center sm:text-left">
          Checkout & Personalization Details
        </h1>
        <p className="text-xs sm:text-sm text-brandText-muted mb-8 text-center sm:text-left">
          Provide contact details to receive your customized 4K wedding invitation preview on WhatsApp.
        </p>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Payment Option */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact & Couple Details */}
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-bold text-maroon pb-2 border-b border-gold/15">
                1. Delivery & Contact Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aditi Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                  <span className="text-[10px] text-brandText-muted">Your video will be delivered here</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aditi@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    Wedding Celebration Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 18th December 2026"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-sm space-y-4">
              <h3 className="font-heading text-lg font-bold text-maroon pb-2 border-b border-gold/15">
                2. Choose Payment Method
              </h3>

              <div className="space-y-3">
                {/* UPI QR Option */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : 'border-gold/25 bg-cream-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="w-5 h-5 text-maroon" />
                    <div>
                      <p className="font-bold text-xs text-maroon">UPI QR Code (GPay / PhonePe / Paytm / BHIM)</p>
                      <p className="text-[10px] text-brandText-muted">Scan QR code with any UPI app — fastest verification</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="accent-maroon"
                  />
                </label>

                {/* Cards Option */}
                <label
                  onClick={() => setPaymentMethod('Cards')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'Cards'
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : 'border-gold/25 bg-cream-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-maroon" />
                    <div>
                      <p className="font-bold text-xs text-maroon">Debit / Credit Cards & Net Banking</p>
                      <p className="text-[10px] text-brandText-muted">All Indian & International banks supported via Razorpay</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'Cards'}
                    onChange={() => setPaymentMethod('Cards')}
                    className="accent-maroon"
                  />
                </label>

                {/* COD Option */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : 'border-gold/25 bg-cream-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-maroon" />
                    <div>
                      <p className="font-bold text-xs text-maroon">Cash on Delivery (Pay on Video Approval)</p>
                      <p className="text-[10px] text-brandText-muted">Review your watermark preview before paying</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="accent-maroon"
                  />
                </label>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-luxury space-y-4">
              <h3 className="font-heading text-lg font-bold text-maroon pb-2 border-b border-gold/15">
                Order Review
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map(({ product, customizationData }) => (
                  <div key={product._id} className="flex gap-3 items-center text-xs">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-12 h-16 object-cover rounded-lg border border-gold/20"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-maroon truncate">{product.title}</h5>
                      <span className="text-[10px] text-brandText-muted block">
                        {customizationData.brideName ? `${customizationData.brideName} & ${customizationData.groomName}` : 'Customized with couple names'}
                      </span>
                      <span className="font-bold text-maroon">₹{product.price?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs text-brandText-muted pt-3 border-t border-gold/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({coupon.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Turnaround Time</span>
                  <span className="text-emerald-700 font-semibold">24 Hours (Express)</span>
                </div>

                <div className="flex justify-between text-base font-bold text-maroon font-heading pt-3 border-t border-gold/15">
                  <span>Total Due</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {loading
                    ? 'Processing Order...'
                    : paymentMethod === 'UPI'
                    ? `Pay ₹${total.toLocaleString('en-IN')} via UPI QR`
                    : `Place Order (₹${total.toLocaleString('en-IN')})`}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-brandText-muted pt-2 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>256-Bit SSL Encrypted & 100% Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>

        </form>

      </div>

      {/* UPI QR Code Payment Modal */}
      {showQrModal && qrData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gold/30 shadow-luxury max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5 relative">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-50 border border-gold/20 flex items-center justify-center hover:bg-rose-50 transition-all"
            >
              <X className="w-4 h-4 text-brandText-muted" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-gold to-gold-light p-[2px] shadow-gold-glow flex items-center justify-center">
                <div className="w-full h-full bg-maroon rounded-full flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-gold-light" />
                </div>
              </div>
              <h2 className="font-heading text-xl font-bold text-maroon">Scan & Pay via UPI</h2>
              <p className="text-[11px] text-brandText-muted">
                Order {qrData.orderNumber} • Open any UPI app to scan
              </p>
            </div>

            {/* Amount Display */}
            <div className="text-center py-3 bg-cream-50 rounded-2xl border border-gold/20">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brandText-muted">Amount to Pay</span>
              <p className="font-heading text-3xl font-bold text-maroon mt-1">
                ₹{Number(qrData.amount).toLocaleString('en-IN')}
              </p>
            </div>

            {/* QR Code Image */}
            <div className="flex justify-center">
              <div className="p-3 bg-white rounded-2xl border-2 border-gold/30 shadow-md">
                <img
                  src={qrData.qrDataUrl}
                  alt="UPI Payment QR Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                />
              </div>
            </div>

            {/* UPI ID Display */}
            <div className="flex items-center justify-between p-3 bg-cream-50 rounded-xl border border-gold/20">
              <div>
                <span className="text-[10px] text-brandText-muted block">UPI ID</span>
                <span className="text-xs font-bold text-maroon font-mono">{qrData.upiId}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-2 rounded-lg bg-maroon text-gold-light hover:bg-maroon-dark transition-all"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* 3-Step Guide */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="p-2 rounded-xl bg-cream-50 border border-gold/20">
                <span className="font-bold text-maroon block">1. Scan & Pay</span>
                <span className="text-brandText-muted text-[9px]">Exact ₹{Number(qrData.amount).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2 rounded-xl bg-cream-50 border border-gold/20">
                <span className="font-bold text-maroon block">2. Copy UTR</span>
                <span className="text-brandText-muted text-[9px]">12-digit ref code</span>
              </div>
              <div className="p-2 rounded-xl bg-cream-50 border border-gold/20">
                <span className="font-bold text-maroon block">3. Submit Below</span>
                <span className="text-brandText-muted text-[9px]">Studio verifies</span>
              </div>
            </div>

            {/* Transaction Reference (Mandatory) */}
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-300/60 space-y-1.5">
              <label className="block text-xs font-bold text-maroon">
                Enter 12-Digit UPI Reference (UTR) Number *
              </label>
              <input
                type="text"
                required
                maxLength={24}
                placeholder="e.g. 431289567123 (from GPay / PhonePe / Paytm)"
                value={upiRefInput}
                onChange={(e) => setUpiRefInput(e.target.value.replace(/\s+/g, ''))}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-gold/40 text-xs bg-white font-mono tracking-wider focus:outline-none focus:border-maroon shadow-inner"
              />
              <p className="text-[10px] text-amber-900/80 leading-tight">
                💡 <strong>Where to find:</strong> Open your UPI app (Google Pay, PhonePe, Paytm, or BHIM) &rarr; tap on this payment in History &rarr; copy the 12-digit <strong>UPI Ref No / UTR</strong>.
              </p>
            </div>

            {/* Error in Modal */}
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Confirm Payment Button */}
            <button
              type="button"
              onClick={handleConfirmUpiPayment}
              disabled={confirmingPayment}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{confirmingPayment ? 'Submitting Reference...' : 'Submit 12-Digit UTR for Verification'}</span>
            </button>

            {/* Supported Apps */}
            <p className="text-center text-[10px] text-brandText-muted">
              Works with Google Pay • PhonePe • Paytm • BHIM • Any UPI App
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
