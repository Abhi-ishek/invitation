import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import videoService from '../services/videoService';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  Film,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  QrCode,
  Copy,
  Check,
  XCircle,
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'verifications' | 'products'
  const [copiedUtr, setCopiedUtr] = useState('');
  const [verifyingId, setVerifyingId] = useState('');

  // Update order modal / state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [finalUrl, setFinalUrl] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderRes, prodRes, verifRes] = await Promise.all([
        videoService.getAllOrders({ limit: 50 }),
        videoService.getProducts({ limit: 50 }),
        videoService.getPendingUpiVerifications().catch(() => ({ data: [] })),
      ]);
      setOrders(orderRes.data?.orders || []);
      setProducts(prodRes.data?.products || []);
      setPendingVerifications(verifRes.data || []);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const handleCopyUtr = (utr) => {
    if (!utr) return;
    navigator.clipboard.writeText(utr).catch(() => {});
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(''), 2500);
  };

  const handleVerifyUpi = async (paymentId, action) => {
    let adminNote = '';
    if (action === 'reject') {
      const promptReason = window.prompt('Enter rejection reason (will be recorded in order notes):');
      if (promptReason === null) return; // user cancelled
      adminNote = promptReason.trim() || 'UTR could not be verified in studio bank account';
    }

    setVerifyingId(paymentId);
    try {
      await videoService.verifyUpiPaymentByAdmin({
        paymentId,
        action,
        adminNote,
      });

      alert(
        action === 'approve'
          ? '✅ Payment approved! Order moved to In Production & customer notified.'
          : '❌ Payment rejected. Order updated.'
      );

      // Refresh list
      await fetchData();
    } catch (err) {
      alert(err.message || 'Action failed');
    } finally {
      setVerifyingId('');
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await videoService.updateOrderStatus(selectedOrder._id, {
        status: newStatus || undefined,
        previewVideoUrl: previewUrl || undefined,
        finalVideoUrl: finalUrl || undefined,
        note: statusNote || undefined,
      });

      // Update in state
      setOrders(orders.map((o) => (o._id === selectedOrder._id ? res.data : o)));
      setSelectedOrder(null);
      alert('Order status successfully updated & email sent to customer!');
    } catch (err) {
      alert(err.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-cream py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gold/20 gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold-dark text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Studio Administration Atelier</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-maroon mt-1">
              Admin Production Hub
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-brandText-muted">Logged in as:</span>
            <span className="px-3 py-1 rounded-full bg-maroon text-gold-light text-xs font-bold">
              {user?.name} (Admin)
            </span>
          </div>
        </div>

        {/* Analytics Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-maroon">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs text-brandText-muted block">Total Atelier Revenue</span>
            <h3 className="font-heading text-2xl font-bold text-maroon">
              ₹{totalSales.toLocaleString('en-IN')}
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-maroon">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs text-brandText-muted block">Orders Received</span>
            <h3 className="font-heading text-2xl font-bold text-maroon">
              {orders.length} Orders
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-maroon">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xs text-brandText-muted block">Active Video Designs</span>
            <h3 className="font-heading text-2xl font-bold text-maroon">
              {products.length} Templates
            </h3>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-gold/25 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gold/15 flex items-center justify-center text-maroon">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs text-brandText-muted block">UPI Verifications</span>
            <h3 className={`font-heading text-2xl font-bold ${pendingVerifications.length > 0 ? 'text-amber-600 animate-pulse' : 'text-maroon'}`}>
              {pendingVerifications.length} Pending
            </h3>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-gold/20 pb-2 flex-wrap">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-maroon text-gold-light shadow-sm'
                : 'bg-white text-brandText hover:bg-cream-100'
            }`}
          >
            Manage Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('verifications')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'verifications'
                ? 'bg-maroon text-gold-light shadow-sm'
                : 'bg-white text-brandText hover:bg-cream-100'
            }`}
          >
            <span>UPI Verifications</span>
            {pendingVerifications.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold animate-pulse">
                {pendingVerifications.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-maroon text-gold-light shadow-sm'
                : 'bg-white text-brandText hover:bg-cream-100'
            }`}
          >
            Manage Catalog ({products.length})
          </button>
        </div>

        {/* Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gold/25 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gold/15 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-maroon">Orders & Status Upgrades</h3>
              <span className="text-xs text-brandText-muted">Click "Update Status" to upload video preview link</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-50 border-b border-gold/15 text-maroon font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Personalization</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="p-4 font-bold text-maroon">{ord.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-semibold block">{ord.customerDetails?.name}</span>
                        <span className="text-brandText-muted block text-[11px]">{ord.customerDetails?.phone}</span>
                        <span className="text-brandText-muted block text-[11px]">{ord.customerDetails?.email}</span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-[11px] text-brandText-muted">
                        {ord.items?.[0]?.customizationData?.brideName
                          ? `${ord.items[0].customizationData.brideName} & ${ord.items[0].customizationData.groomName}`
                          : 'General customization'}
                      </td>
                      <td className="p-4 font-bold text-maroon">
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Preview Ready'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-gold/20 text-maroon'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setNewStatus(ord.orderStatus);
                            setPreviewUrl(ord.previewVideoUrl || '');
                            setFinalUrl(ord.finalVideoUrl || '');
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-maroon text-gold-light hover:bg-maroon-light font-semibold text-[11px] shadow-sm transition-all"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* UPI Verifications Table */}
        {activeTab === 'verifications' && (
          <div className="bg-white rounded-3xl border border-gold/25 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gold/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-maroon flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-gold-dark" />
                  <span>Manual UPI Payments Verification</span>
                </h3>
                <p className="text-xs text-brandText-muted">
                  Cross-check the 12-digit UTR in your bank/UPI app before approving for production.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-cream-50 border border-gold/20 text-xs font-bold text-maroon">
                {pendingVerifications.length} Awaiting Studio Check
              </span>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-heading text-lg font-bold text-maroon">All Clear!</h4>
                <p className="text-xs text-brandText-muted max-w-sm mx-auto">
                  There are no pending UPI verification requests at this moment. New customer UTR submissions will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-50 border-b border-gold/15 text-maroon font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">12-Digit UPI UTR</th>
                      <th className="p-4">Submitted At</th>
                      <th className="p-4 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {pendingVerifications.map((payment) => {
                      const orderRef = payment.order?.orderNumber || 'N/A';
                      const customerName = payment.customerDetails?.name || payment.order?.customerDetails?.name || 'Customer';
                      const customerPhone = payment.customerDetails?.phone || payment.order?.customerDetails?.phone || 'N/A';
                      const utr = payment.upiTransactionRef || 'N/A';
                      const isVerifying = verifyingId === payment._id;

                      return (
                        <tr key={payment._id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="p-4 font-bold text-maroon">
                            <span className="block">{orderRef}</span>
                            <span className="text-[10px] text-amber-700 font-semibold px-2 py-0.5 rounded-full bg-amber-100 inline-block mt-1">
                              Payment Under Review
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold block text-brandText">{customerName}</span>
                            <span className="text-brandText-muted block text-[11px] font-mono">{customerPhone}</span>
                          </td>
                          <td className="p-4 font-heading font-bold text-base text-maroon">
                            ₹{payment.amount?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-maroon bg-cream-50 px-2.5 py-1 rounded-lg border border-gold/30">
                                {utr}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopyUtr(utr)}
                                title="Copy UTR to verify in Bank App"
                                className="p-1.5 rounded-lg bg-cream-50 border border-gold/20 hover:bg-gold/10 text-maroon transition-all"
                              >
                                {copiedUtr === utr ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-brandText-muted" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-brandText-muted text-[11px]">
                            {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                disabled={isVerifying}
                                onClick={() => handleVerifyUpi(payment._id, 'approve')}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{isVerifying ? 'Verifying...' : 'Approve & Start Production'}</span>
                              </button>
                              <button
                                type="button"
                                disabled={isVerifying}
                                onClick={() => handleVerifyUpi(payment._id, 'reject')}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-[11px] transition-all disabled:opacity-50"
                              >
                                <span>Reject</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-gold/25 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gold/15">
              <h3 className="font-heading text-lg font-bold text-maroon">Video Invitation Templates</h3>
              <span className="text-xs text-brandText-muted">Total: {products.length} designs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p._id} className="p-3 bg-cream-50 rounded-2xl border border-gold/20 flex gap-3 items-center">
                  <img src={p.thumbnail} alt={p.title} className="w-14 h-20 object-cover rounded-xl border border-gold/20" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] uppercase font-bold text-gold-dark">{p.category}</span>
                    <h5 className="font-bold text-xs text-maroon truncate">{p.title}</h5>
                    <p className="text-xs font-semibold text-maroon">₹{p.price?.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-brandText-muted">Sales: {p.salesCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Update Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 border border-gold/30 shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-maroon">
              Update Order: {selectedOrder.orderNumber}
            </h3>
            <p className="text-xs text-brandText-muted">
              Updating the status triggers an automatic customer email notification.
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1">Status Step</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="In Production">In Production</option>
                  <option value="Preview Ready">Preview Ready</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Preview Video URL (Cloudinary / MP4)
                </label>
                <input
                  type="url"
                  placeholder="https://res.cloudinary.com/vrljkq9h/video/upload/..."
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Final 4K Video URL (for Download)
                </label>
                <input
                  type="url"
                  placeholder="https://...final-4k-render.mp4"
                  value={finalUrl}
                  onChange={(e) => setFinalUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Status Note to Customer</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Your first preview is rendered. Please check slide 3 for date accuracy..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gold/30 text-xs bg-cream-50"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-2.5 rounded-xl bg-maroon text-gold-light text-xs font-bold shadow-md hover:bg-maroon-light transition-all disabled:opacity-50"
                >
                  {updating ? 'Updating & Sending Email...' : 'Save & Notify Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
