import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import { ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Banknote, Smartphone, Lock, QrCode, X, Copy, Check, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, coupon, getSubtotal, getDiscountAmount, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [weddingDate, setWeddingDate] = useState(items[0]?.customizationData?.weddingDate || '');
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

  React.useEffect(() => {
    if (!user) {
      navigate('/login', {
        replace: true,
        state: {
          from: '/checkout',
          message: 'Please sign in or create an account to complete your purchase.',
        },
      });
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

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
        paymentMethod: 'UPI',
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

    setConfirmingPayment(true);
    setError('');

    try {
      await videoService.confirmUpiPayment({
        orderId: qrData.orderId,
        paymentId: qrData.paymentId,
      });

      setShowQrModal(false);
      fireConfetti();
      clearCart();
      navigate(`/customize-order/${encodeURIComponent(qrData.orderNumber)}`);
    } catch (err) {
      setError(err.message || 'Payment confirmation failed. Please contact support.');
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-brandText">
                      Wedding Celebration Date
                    </label>
                    {weddingDate && (
                      <span className="text-[11px] font-bold text-maroon bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                        🗓️ {formatReadableDate(weddingDate)}
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
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold cursor-pointer font-body shadow-inner"
                    />
                    <Calendar className="w-4 h-4 text-gold-dark absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-brandText-muted mt-1 block">
                    Tap to choose your wedding date from the calendar
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method - Exclusively UPI */}
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                <h3 className="font-heading text-lg font-bold text-maroon">
                  2. Payment Method
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-700" /> Instant UPI QR
                </span>
              </div>

              {/* UPI QR Exclusive Card */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-gold bg-gradient-to-br from-gold/10 via-cream-50 to-white shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-maroon text-gold-light flex items-center justify-center flex-shrink-0 shadow-sm">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-maroon flex items-center gap-1.5">
                        <span>UPI QR Code Payment</span>
                        <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Active</span>
                      </p>
                      <p className="text-[11px] text-brandText-muted mt-0.5">
                        Scan dynamically generated QR code with any UPI app
                      </p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-maroon text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="pt-2.5 border-t border-gold/20 flex flex-wrap items-center justify-between text-[11px] text-brandText-muted gap-2">
                  <span className="flex items-center gap-1.5 text-brandText-muted">
                    <Smartphone className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Google Pay • PhonePe • Paytm • BHIM • Cred UPI</span>
                  </span>
                  <span className="text-maroon font-mono font-bold bg-cream-100 px-2.5 py-0.5 rounded-lg border border-gold/30">
                    9161772464@ptsbi
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-brandText-muted leading-relaxed">
                💡 A dynamic QR code with the exact order amount (<strong>₹{total.toLocaleString('en-IN')}</strong>) will be presented upon clicking place order.
              </p>
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
                    ? 'Generating UPI QR...'
                    : `Pay ₹${total.toLocaleString('en-IN')} via UPI QR`}
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
              <div className="p-2 bg-white rounded-2xl border-2 border-gold/30 shadow-md overflow-hidden">
                <img
                  src={qrData.customQrImage || '/upi-qr.jpg'}
                  alt="UPI Payment QR Code - Shivam Thakur"
                  className="w-60 sm:w-64 h-auto object-contain rounded-xl"
                />
              </div>
            </div>

            {/* UPI ID Display */}
            <div className="flex items-center justify-between p-3 bg-cream-50 rounded-xl border border-gold/20">
              <div>
                <span className="text-[10px] text-brandText-muted block">
                  Payee: <strong className="text-maroon font-semibold">{qrData.payeeName || 'Shivam Thakur'}</strong>
                </span>
                <span className="text-xs font-bold text-maroon font-mono">{qrData.upiId || 'shivamthakur.shivi-5@okaxis'}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="p-2 rounded-lg bg-maroon text-gold-light hover:bg-maroon-dark transition-all"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
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
              className="w-full py-4 rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 hover:from-emerald-700 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{confirmingPayment ? 'Verifying Payment...' : "I've Completed the Payment"}</span>
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
