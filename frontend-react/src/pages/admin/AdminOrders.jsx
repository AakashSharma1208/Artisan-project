import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  Package,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { adminService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
    processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status?.toLowerCase()] || styles.pending}`}>
      {status || 'Pending'}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await adminService.getOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Order fetch failed:', err);
      setFeedback({ type: 'error', message: 'Failed to connect to order database.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await adminService.updateOrderStatus(id, newStatus);
      setFeedback({ type: 'success', message: `Order updated to ${newStatus}.` });
      fetchOrders();
      if (selectedOrder?._id === id) setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update order status.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredOrders = orders.filter(o => 
    o._id.toLowerCase().includes(search.toLowerCase()) || 
    o.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 lg:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 font-poppins tracking-tight uppercase italic">Order Control Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor platform transaction history and logistics.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by ID, Name or Email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 dark:text-white transition-all shadow-inner"
          />
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl flex items-center gap-3 border shadow-2xl z-50 fixed top-24 right-8 max-w-sm ${feedback.type === 'success' ? 'bg-green-500 text-white border-transparent' : 'bg-red-500 text-white border-transparent'}`}>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-black uppercase tracking-widest">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4 font-poppins">
        {filteredOrders.map((order) => (
          <motion.div layout key={order._id} className="bg-white dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-gold-200 dark:hover:border-gold-900 transition-all overflow-hidden group">
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-primary-50 dark:bg-gold-900/10 flex items-center justify-center text-primary-700 dark:text-primary-500 border border-gold-100 dark:border-gold-900/30">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter text-lg leading-tight truncate">#{order._id.slice(-8).toUpperCase()}</h3>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 text-primary-600" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><IndianRupee className="w-3 h-3 text-green-500" /> {order.totalPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-center">
                <StatusBadge status={order.orderStatus} />
                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block" />
                <div className="relative group/select">
                  <select 
                    value={order.orderStatus}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="appearance-none bg-slate-50 dark:bg-slate-900 pl-4 pr-10 py-2.5 rounded-xl border-none text-[10px] font-black text-slate-500 dark:text-slate-400 outline-none focus:ring-2 focus:ring-primary-600/20 cursor-pointer uppercase tracking-widest transition-all hover:bg-primary-50 dark:hover:bg-gold-900/20"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-primary-600 rounded-2xl transition-all border border-transparent hover:border-gold-100"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Quick Summary of items */}
            <div className="px-6 py-4 bg-slate-50/30 dark:bg-slate-900/20 border-t border-slate-50 dark:border-slate-900 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-2">Artifacts:</span>
              {(order.products || []).map((item, idx) => (
                <div key={idx} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                  <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-tight">{item.name || 'Handcrafted Item'}</span>
                  <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-gold-900/20 px-1.5 py-0.5 rounded-md">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="p-24 text-center bg-white dark:bg-slate-950 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-inner">
            <ShoppingBag className="w-16 h-16 text-slate-200 dark:text-slate-800 dark:text-slate-100 mx-auto mb-6 opacity-50" />
            <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest italic">Zero Orders Logged</h3>
            <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-sm mt-1">No transactions match your search parameters.</p>
          </div>
        )}
      </div>

      {/* Modern Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-950 rounded-[3rem] p-10 w-full max-w-2xl shadow-2xl border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6">
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all shadow-sm"><XCircle className="w-8 h-8 text-slate-400" /></button>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] mb-2 px-1">Order Particulars</h4>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white font-poppins tracking-tighter uppercase italic leading-none">#{selectedOrder._id}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8 ring-1 ring-slate-100 dark:ring-slate-800 p-8 rounded-[2rem]">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Profile</h4>
                  <div className="space-y-0.5">
                    <p className="font-black text-slate-900 dark:text-slate-100 uppercase text-sm tracking-tight">{selectedOrder.userId?.name || 'Anonymous Artisan'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 underline underline-offset-4 decoration-gray-200 dark:decoration-gray-800">{selectedOrder.userId?.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Ledger</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-primary-600 tracking-tighter leading-none">₹{selectedOrder.totalPrice}</span>
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-green-500/20">{selectedOrder.paymentStatus}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Artifact Inventory</h4>
                <div className="grid gap-2">
                  {(selectedOrder.products || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-gold-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary-600 transition-colors">
                          <Package className="w-5 h-5 " />
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{item.productId || 'Item'} - Qty: {item.quantity}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900 dark:text-slate-100">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 dark:text-white text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
                >
                  Dismiss Ledger
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
