import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import { CreditCard, CheckCircle2, Clock, AlertTriangle, ArrowRight, QrCode, Banknote } from 'lucide-react';

const statusConfig = {
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  pending_verification: { label: 'Under Studio Review', color: 'bg-amber-100 text-amber-800', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-amber-100 text-amber-800', icon: Clock },
  failed: { label: 'Failed', color: 'bg-rose-100 text-rose-800', icon: AlertTriangle },
  refunded: { label: 'Refunded', color: 'bg-blue-100 text-blue-800', icon: CreditCard },
};

const methodIcons = {
  UPI: QrCode,
  Razorpay: CreditCard,
  COD: Banknote,
  Cards: CreditCard,
};

export default function PaymentHistoryPage() {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  useEffect(() => {
    if (user) {
      loadPayments(1);
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadPayments = async (page) => {
    setLoading(true);
    try {
      const res = await videoService.getPaymentHistory({ page, limit: 15 });
      setPayments(res.data?.payments || []);
      setPagination(res.data?.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gold/25 text-center space-y-4">
          <CreditCard className="w-12 h-12 text-gold mx-auto" />
          <h2 className="font-heading text-2xl font-bold text-maroon">Payment History</h2>
          <p className="text-xs text-brandText-muted">Please sign in to view your payment transactions.</p>
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
            Transaction Archive
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-1">
            Payment History
          </h1>
          <p className="text-xs sm:text-sm text-brandText-muted mt-1">
            View all your payment transactions, UPI QR payments, and order receipts.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-brandText-muted">
            <div className="w-10 h-10 border-4 border-gold border-t-maroon rounded-full animate-spin mx-auto mb-3" />
            Loading your payment history...
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-gold/25 text-center space-y-4">
            <CreditCard className="w-12 h-12 text-gold mx-auto" />
            <h3 className="font-heading text-xl font-bold text-maroon">No Payments Yet</h3>
            <p className="text-xs text-brandText-muted max-w-sm mx-auto">
              You haven't made any payments yet. Browse our royal wedding invitation designs to get started!
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
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-gold/25 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brandText-muted">Total Payments</p>
                <p className="font-heading text-2xl font-bold text-maroon mt-1">{pagination.total}</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gold/25 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brandText-muted">Successful</p>
                <p className="font-heading text-2xl font-bold text-emerald-700 mt-1">
                  {payments.filter((p) => p.status === 'paid').length}
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gold/25 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brandText-muted">Total Spent</p>
                <p className="font-heading text-2xl font-bold text-maroon mt-1">
                  ₹{payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-gold/25 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brandText-muted">Pending</p>
                <p className="font-heading text-2xl font-bold text-amber-600 mt-1">
                  {payments.filter((p) => p.status === 'pending').length}
                </p>
              </div>
            </div>

            {/* Payment List */}
            <div className="space-y-3">
              {payments.map((payment) => {
                const config = statusConfig[payment.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                const MethodIcon = methodIcons[payment.method] || CreditCard;

                return (
                  <div
                    key={payment._id}
                    className="p-5 bg-white rounded-3xl border border-gold/25 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-cream-50 border border-gold/20 flex items-center justify-center flex-shrink-0">
                        <MethodIcon className="w-5 h-5 text-maroon" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-base font-bold text-maroon">
                            ₹{payment.amount?.toLocaleString('en-IN')}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${config.color} flex items-center gap-1`}>
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cream-50 border border-gold/20 text-brandText-muted">
                            {payment.method}
                          </span>
                        </div>
                        <p className="text-xs text-brandText-muted">
                          {payment.order?.orderNumber || 'N/A'} • {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {payment.upiTransactionRef ? (
                          <p className="text-[10px] text-amber-800 font-mono font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                            UTR: {payment.upiTransactionRef}
                          </p>
                        ) : payment.transactionId ? (
                          <p className="text-[10px] text-brandText-muted font-mono">
                            Ref: {payment.transactionId}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {payment.order?.orderNumber && (
                      <Link
                        to={`/track/${encodeURIComponent(payment.order.orderNumber)}`}
                        className="px-4 py-2 rounded-full bg-maroon text-gold-light hover:bg-maroon-light text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all flex-shrink-0"
                      >
                        <span>Track Order</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => loadPayments(pageNum)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      pageNum === pagination.page
                        ? 'bg-maroon text-gold-light shadow-sm'
                        : 'bg-cream-50 text-brandText-muted border border-gold/20 hover:bg-gold/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

