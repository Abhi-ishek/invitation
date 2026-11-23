import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import SEO from '../components/SEO';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  Lock,
  ChevronRight,
  Gift,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const formatReadableDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
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
  
  // Payment Method selection: 'Razorpay' (Default) or 'UPI' (Direct QR)
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayKeyId, setRazorpayKeyId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // UPI QR Modal State (Fallback / Alternative)
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [upiRefInput, setUpiRefInput] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  // Check Razorpay SDK & config from backend on mount
  useEffect(() => {
    // Check if Razorpay Checkout.js is loaded
    const checkRazorpay = () => {
      if (window.Razorpay) {
        setRazorpayLoaded(true);
      } else {
        // Retry after a short delay in case script is still loading
        setTimeout(() => {
          setRazorpayLoaded(Boolean(window.Razorpay));
          if (!window.Razorpay) {
            console.warn('Razorpay Checkout.js not loaded. Falling back to UPI.');
            setPaymentMethod('UPI');
          }
        }, 2000);
      }
    };
    checkRazorpay();

    // Fetch Razorpay public config
    const fetchConfig = async () => {
      try {
        const res = await videoService.getRazorpayConfig();
        if (res.data?.keyId) {
          setRazorpayKeyId(res.data.keyId);
        }
      } catch (e) {
        console.warn('Razorpay config fetch failed:', e);
      }
    };
    fetchConfig();
  }, []);

  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
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
        paymentMethod: paymentMethod,
        couponCode: coupon?.code,
      };

      const res = await videoService.createOrder(orderPayload);
      const createdOrder = res.data;

      // 1. RAZORPAY PAYMENT GATEWAY
      if (paymentMethod === 'Razorpay') {
        try {
          const rzpRes = await videoService.createRazorpayOrder({
            orderId: createdOrder._id,
          });

          const { razorpayOrderId, amount, currency, keyId } = rzpRes.data;

          if (!razorpayOrderId) {
            throw new Error('Could not create Razorpay order');
          }

          const activeKey = keyId || razorpayKeyId;
          if (!activeKey || activeKey === 'your_razorpay_key_id') {
            throw new Error('Razorpay is not configured with active API keys yet in server/.env. Please configure RAZORPAY_KEY_ID.');
          }

          if (!window.Razorpay) {
            throw new Error('Razorpay SDK is still loading. Please try again.');
          }

          const options = {
            key: activeKey,
            amount: amount,
            currency: currency || 'INR',
            name: 'Wedding Wishcraft',
            description: `Wedding Invitation Video - ${createdOrder.orderNumber}`,
            order_id: razorpayOrderId,
            prefill: {
              name: name,
              email: email,
              contact: phone,
            },
            theme: { color: '#3A0A1E' },
            handler: async function (response) {
              // On success: verify payment
              try {
                const verifyRes = await videoService.verifyRazorpayPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  dbOrderId: createdOrder._id,
                });
                if (verifyRes.data?.verified) {
                  fireConfetti();
                  clearCart();
                  navigate(`/order-success/${encodeURIComponent(createdOrder.orderNumber)}`);
                } else {
                  setError('Payment verification pending. Please check order status.');
                }
              } catch (err) {
                setError('Payment verification failed. Please contact support.');
              }
              setLoading(false);
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                setError('Payment was cancelled. You can try again.');
              },
            },
          };

          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', function (response) {
            setLoading(false);
            setError(`Payment failed: ${response.error.description}`);
          });
          rzp.open();
          return;
        } catch (rzpErr) {
          console.error('Razorpay order creation failed, switching to UPI QR fallback:', rzpErr);
          setPaymentMethod('UPI');
          setError(rzpErr.message || 'Razorpay payment could not be initialized. Please use UPI QR.');
          setLoading(false);
          return;
        }
      }

      // 2. DIRECT UPI QR CODE PAYMENT
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

      // Fallback
      fireConfetti();
      clearCart();
      navigate(`/order-success/${encodeURIComponent(createdOrder.orderNumber)}`);
    } catch (err) {
      const errMsg = err.message || '';
      if (
        errMsg.toLowerCase().includes('jwt') ||
        errMsg.toLowerCase().includes('token') ||
        errMsg.toLowerCase().includes('session')
      ) {
        setError('Your login session expired. Please click "Pay & Place Order" again to proceed.');
      } else {
        setError(errMsg || 'Failed to place order. Please try again.');
      }
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
        upiTransactionRef: upiRefInput.trim(),
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
      <SEO title="Secure Checkout" noindex />
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold font-body"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    WhatsApp Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold font-body"
                  />
                  <span className="text-[10px] text-brandText-muted mt-1 block">
                    Your final 4K video invitation will be delivered here
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brandText mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. priya@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gold/30 text-xs bg-cream-50 focus:outline-none focus:border-gold font-body"
                  />
                  <span className="text-[10px] text-brandText-muted mt-1 block">
                    Receipt and download link backup
                  </span>
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

            {/* Payment Method - Razorpay Gateway & Direct UPI QR */}
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gold/15">
                <h3 className="font-heading text-lg font-bold text-maroon">
                  2. Select Payment Method
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" /> 100% Secure Checkout
                </span>
              </div>

              <div className="space-y-3">
                {/* Option 1: Razorpay Secure Payment (UPI, Cards, NetBanking, Wallets) */}
                <label
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    paymentMethod === 'Razorpay'
                      ? 'border-gold bg-gradient-to-br from-gold/15 via-cream-50 to-white shadow-sm'
                      : 'border-gold/20 hover:border-gold/40 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                      className="mt-1 text-gold focus:ring-gold"
                    />
                    <div className="w-10 h-10 rounded-xl bg-maroon text-gold-light flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs sm:text-sm text-maroon flex items-center gap-1.5">
                        <span>Razorpay Secure Payment</span>
                        <span className="text-[10px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Recommended
                        </span>
                      </p>
                      <p className="text-[11px] text-brandText-muted mt-0.5">
                        Google Pay, PhonePe, Paytm, Cards (Visa/Mastercard/RuPay), NetBanking & EMI
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-maroon hidden sm:block">Instant</span>
                </label>


              </div>

              <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 flex items-center gap-2 text-xs text-brandText-muted">
                <Lock className="w-4 h-4 text-gold-dark flex-shrink-0" />
                <span>256-bit encrypted bank transmission • Verified by Razorpay & RBI</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-7 bg-white rounded-3xl border border-gold/25 shadow-luxury space-y-6 sticky top-28">
              <h3 className="font-heading text-lg font-bold text-maroon pb-2 border-b border-gold/15">
                Order Summary ({items.length} {items.length === 1 ? 'Design' : 'Designs'})
              </h3>

              {/* Items List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center py-2 border-b border-gold/10 last:border-0">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover border border-gold/20 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-xs text-maroon truncate">
                        {item.product.title}
                      </h4>
                      <p className="text-[10px] text-brandText-muted truncate">
                        Theme: {item.customizationData?.language || 'English & Hindi'}
                      </p>
                      <p className="text-xs font-bold text-gold-dark mt-0.5">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 border-t border-gold/15 pt-4 text-xs font-body">
                <div className="flex justify-between text-brandText-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-brandText">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" /> Coupon Discount ({coupon?.code})
                    </span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-brandText-muted">
                  <span>4K Video Rendering & Express Queue</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between text-brandText-muted">
                  <span>Delivery via WhatsApp</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                    Included (24 Hours)
                  </span>
                </div>

                <div className="border-t border-gold/20 pt-3 flex justify-between items-baseline">
                  <span className="font-heading font-bold text-sm text-maroon">Total Payable</span>
                  <div className="text-right">
                    <span className="font-heading text-2xl font-black text-maroon">
                      ₹{total}
                    </span>
                    <span className="block text-[10px] text-brandText-muted">All taxes included</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                  {error}
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-105 text-maroon font-extrabold text-sm uppercase tracking-wider shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{loading ? 'Initiating Payment...' : `Pay ₹${total} & Place Order`}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center">
                <span className="text-[10px] text-brandText-muted">
                  ✨ Instant preview ready within 24 hours of payment verification
                </span>
              </div>

            </div>

          </div>

        </form>

      </div>

      {/* UPI QR Modal (Fallback / Manual Scan) */}
      {showQrModal && qrData && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-gold/40 shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center pb-3 border-b border-gold/15">
              <span className="font-heading text-lg font-bold text-maroon">
                Scan & Pay with any UPI App
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Branded QR Code */}
            <div className="bg-[#FFF8F0] p-4 rounded-2xl border-2 border-gold/40 inline-block mx-auto shadow-inner">
              <img
                src={qrData.qrDataUrl || qrData.customQrImage}
                alt="UPI Payment QR"
                className="w-56 h-56 mx-auto rounded-lg object-contain"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-brandText-muted">Amount to Pay</span>
              <p className="font-heading text-2xl font-extrabold text-maroon">
                ₹{qrData.amount}
              </p>
              <p className="text-[11px] text-gray-500">
                Order ID: <span className="font-mono font-bold text-maroon">{qrData.orderNumber}</span>
              </p>
            </div>

            {/* UPI ID Copy Field */}
            <div className="p-3 rounded-xl bg-cream-50 border border-gold/25 flex items-center justify-between gap-2 text-left">
              <div className="min-w-0">
                <span className="text-[10px] text-brandText-muted block uppercase">UPI ID</span>
                <span className="text-xs font-mono font-bold text-maroon truncate block">
                  {qrData.upiId}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUpi}
                className="px-3 py-1.5 rounded-lg bg-gold/20 hover:bg-gold/30 text-maroon font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* UTR Input */}
            <div className="text-left space-y-1">
              <label className="text-[11px] font-semibold text-brandText block">
                Enter 12-Digit UPI Ref / UTR No. (Optional)
              </label>
              <input
                type="text"
                value={upiRefInput}
                onChange={(e) => setUpiRefInput(e.target.value)}
                placeholder="e.g. 431289456123"
                className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs focus:ring-2 focus:ring-gold/60 focus:outline-none"
              />
            </div>

            {/* Confirm Payment CTA */}
            <button
              onClick={handleConfirmUpiPayment}
              disabled={confirmingPayment}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{confirmingPayment ? 'Confirming...' : 'I Have Made The Payment'}</span>
            </button>

            <p className="text-[10px] text-brandText-muted">
              Once clicked, your invitation video will immediately enter the production queue.
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
