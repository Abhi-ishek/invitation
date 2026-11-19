import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Sparkles, ArrowRight, Activity, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import videoService from '../services/videoService';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const cfOrderId = searchParams.get('cf_order_id');

  const [verifying, setVerifying] = useState(Boolean(cfOrderId));
  const [paymentVerified, setPaymentVerified] = useState(!cfOrderId);
  const [verifyMessage, setVerifyMessage] = useState('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    // If redirected back from Cashfree with a cf_order_id, verify payment with backend
    if (cfOrderId) {
      const verify = async () => {
        try {
          const res = await videoService.verifyCashfreePayment({
            orderId: orderNumber,
            cfOrderId: cfOrderId,
          });

          if (res.data?.verified) {
            setPaymentVerified(true);
            setVerifyMessage('Your Cashfree payment was verified and approved by the bank.');
          } else {
            setVerifyMessage(`Cashfree payment status: ${res.data?.status || 'Pending'}. Our studio will verify your transaction shortly.`);
          }
        } catch (err) {
          console.error('Error verifying Cashfree payment on success page:', err);
          setVerifyMessage('Payment registered. Verification will automatically complete in studio queue.');
        } finally {
          setVerifying(false);
        }
      };
      verify();
    }
  }, [cfOrderId, orderNumber]);

  return (
    <div className="min-h-[75vh] bg-cream flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gold/30 shadow-luxury text-center space-y-6">
        
        {/* Verification Loader or Success Icon */}
        {verifying ? (
          <div className="w-20 h-20 mx-auto rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center text-maroon animate-spin">
            <Loader2 className="w-10 h-10" />
          </div>
        ) : (
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-600 shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        )}

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark block">
            {verifying ? 'Verifying Transaction...' : 'Order Confirmed!'}
          </span>
          <h1 className="font-heading text-3xl font-bold text-maroon mt-1">
            {verifying ? 'Confirming Payment' : 'Congratulations!'}
          </h1>
          <p className="text-xs text-brandText-muted mt-2">
            {verifyMessage || 'Your wedding invitation video request has been registered in our studio queue.'}
          </p>
        </div>

        {/* Order Number Box */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-gold/25 space-y-1">
          <span className="text-[11px] text-brandText-muted block uppercase tracking-wider">Your Order Reference</span>
          <span className="font-heading text-2xl font-extrabold text-maroon tracking-wider">
            {orderNumber || '#WW12345'}
          </span>
          <p className="text-[10px] text-emerald-700 font-semibold">
            Status: {paymentVerified ? 'Payment Verified • In Production' : 'Processing Payment'} • Estimated Preview: Within 24 Hours
          </p>
        </div>

        <p className="text-xs text-brandText-muted leading-relaxed">
          Our senior motion artist will contact you via WhatsApp for any additional couple photo updates or revisions.
        </p>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link
            to={`/customize-order/${encodeURIComponent(orderNumber || '')}`}
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-maroon font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Update Wedding & Ceremony Details</span>
          </Link>

          <Link
            to={`/track/${encodeURIComponent(orderNumber || '')}`}
            className="w-full py-3.5 rounded-full bg-maroon text-gold-light hover:bg-maroon-dark font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Track Order Timeline</span>
          </Link>

          <a
            href={`https://wa.me/917018353733?text=Hi%20Wedding%20Wishcraft!%20My%20order%20number%20is%20${encodeURIComponent(orderNumber || '')}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-300 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Open WhatsApp Atelier</span>
          </a>
        </div>

      </div>
    </div>
  );
}
