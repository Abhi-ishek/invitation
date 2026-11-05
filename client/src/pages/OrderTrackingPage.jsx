import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videoService from '../services/videoService';
import {
  Search,
  CheckCircle2,
  Clock,
  Download,
  Play,
  Film,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';

const TIMELINE_STEPS = [
  { key: 'Order Placed', label: 'Order Placed', desc: 'Order details and personalization received.' },
  { key: 'In Production', label: 'In Production', desc: 'Motion artists rendering 3D/4K scenes and soundtrack.' },
  { key: 'Preview Ready', label: 'Preview Ready', desc: 'Watermark preview ready for couple review.' },
  { key: 'Completed', label: 'Completed', desc: 'Final Ultra-HD 4K video rendered and delivered!' },
];

export default function OrderTrackingPage() {
  const { orderNumber: paramNumber } = useParams();
  const navigate = useNavigate();

  const [inputNumber, setInputNumber] = useState(paramNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTracking = async (num) => {
    if (!num) return;
    setLoading(true);
    setError('');
    try {
      const res = await videoService.trackOrder(num.trim());
      setOrder(res.data);
    } catch (err) {
      setError(err.message || 'Order not found. Please verify your order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramNumber) {
      setInputNumber(paramNumber);
      fetchTracking(paramNumber);
    }
  }, [paramNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputNumber.trim()) {
      navigate(`/track/${encodeURIComponent(inputNumber.trim())}`);
      fetchTracking(inputNumber.trim());
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Payment Verification': return 0;
      case 'In Production': return 1;
      case 'Preview Ready': return 2;
      case 'Completed': return 3;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Real-Time Production Tracker
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon">
            Track Your Invitation Video
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted max-w-lg mx-auto">
            Enter your order number (e.g. <span className="font-bold text-maroon">#WW12345</span>) to check live status and watch your preview video.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brandText-light" />
            <input
              type="text"
              placeholder="Enter Order # (e.g. #WW84219)"
              value={inputNumber}
              onChange={(e) => setInputNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gold/30 bg-white text-xs sm:text-sm text-brandText uppercase tracking-wider focus:outline-none focus:border-gold"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-maroon text-gold-light font-bold text-xs uppercase tracking-wider shadow-md hover:bg-maroon-light transition-all"
          >
            Track
          </button>
        </form>

        {loading && (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-gold border-t-maroon rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-brandText-muted">Retrieving production timeline...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Order Details & Vertical Timeline */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/30 shadow-luxury space-y-8">
            
            {/* Top Summary Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gold/15 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                  Order Reference
                </span>
                <h2 className="font-heading text-2xl font-bold text-maroon">
                  {order.orderNumber}
                </h2>
                <p className="text-xs text-brandText-muted">
                  Customer: <span className="font-semibold text-brandText">{order.customerDetails?.name}</span> ({order.customerDetails?.phone})
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brandText-muted block">
                  Current Status
                </span>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-gold text-maroon mt-1 shadow-sm">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* UPI Payment Verification Banner */}
            {(order.orderStatus === 'Payment Verification' || order.paymentStatus === 'under_review') && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-spin" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-950">
                    UPI Payment Verification in Progress
                  </p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    We received your UPI payment reference and are cross-checking with our merchant account. Your order will automatically move to <strong>In Production</strong> once verified.
                  </p>
                </div>
              </div>
            )}

            {/* Vertical Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold/30">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Step Icon / Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-white border-2 border-gold/40 text-brandText-light'
                      } ${isCurrent ? 'ring-4 ring-gold/40 scale-110' : ''}`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Step Details */}
                    <div>
                      <h4
                        className={`font-heading text-base font-bold ${
                          isPassed ? 'text-maroon' : 'text-brandText-light'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-xs text-brandText-muted mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Preview & Download Video Player Area (When Preview Ready or Completed) */}
            {(order.orderStatus === 'Preview Ready' || order.orderStatus === 'Completed' || order.previewVideoUrl || order.finalVideoUrl) && (
              <div className="mt-8 pt-8 border-t border-gold/20 space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <Film className="w-3.5 h-3.5" />
                  <span>Your 4K Invitation Video is Ready!</span>
                </div>

                <div className="max-w-xs mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/40 bg-black">
                  <video
                    src={order.finalVideoUrl || order.previewVideoUrl || 'https://res.cloudinary.com/vrljkq9h/video/upload/q_auto,vc_auto/Sample_1.mp4'}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={order.finalVideoUrl || order.previewVideoUrl || 'https://res.cloudinary.com/vrljkq9h/video/upload/q_auto,vc_auto/Sample_1.mp4'}
                    download={`Wedding-Wishcraft-${order.orderNumber}.mp4`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Final 4K Video</span>
                  </a>

                  <a
                    href={`https://wa.me/917018353733?text=Hi%20Atelier!%20I%20have%20reviewed%20video%20for%20order%20${encodeURIComponent(order.orderNumber)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-3 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 hover:bg-emerald-100"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Request Revisions on WhatsApp</span>
                  </a>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
