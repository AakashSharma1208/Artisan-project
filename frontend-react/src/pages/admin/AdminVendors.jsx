import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Store, 
  ExternalLink,
  ShieldAlert,
  Search,
  Check,
  X,
  Mail,
  User
} from 'lucide-react';
import { adminService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await adminService.getVendors();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch vendors:', err);
      setFeedback({ type: 'error', message: 'Database connection failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, isApproved) => {
    try {
      await adminService.approveVendor(id, isApproved);
      setFeedback({ 
        type: 'success', 
        message: isApproved ? 'Vendor application approved!' : 'Vendor status revoked.' 
      });
      fetchVendors();
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to update vendor status.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const filteredVendors = vendors.filter(v => {
    const shopName = (v.vendorName || v.shopName || '').toLowerCase();
    const ownerName = (v.ownerName || '').toLowerCase();
    const email = (v.email || '').toLowerCase();
    const searchTerm = search.toLowerCase();
    return shopName.includes(searchTerm) || ownerName.includes(searchTerm) || email.includes(searchTerm);
  });

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-poppins">Artisans & Shops</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review applications and manage artisan identities.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all focus-within:ring-2 focus-within:ring-purple-400/20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search shops, owners, or emails..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-0 dark:text-white"
          />
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl flex items-center gap-3 border shadow-sm ${
              feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-800'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <span className="text-sm font-semibold">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <motion.div 
            layout
            key={vendor._id}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Approval Indicator Bar */}
            <div className={`absolute top-0 left-0 w-1 h-full ${vendor.isApproved ? 'bg-green-500' : 'bg-yellow-400 animate-pulse'}`} />

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 border border-purple-100/50 dark:border-purple-800/30">
                {vendor.profileImage ? <img src={vendor.profileImage} className="w-full h-full object-cover rounded-2xl" alt="" /> : <Store className="w-8 h-8" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2 truncate uppercase tracking-tight">
                  {vendor.vendorName || vendor.shopName || 'Unnamed Shop'}
                  {vendor.isApproved && <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500/10" />}
                </h3>
                <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1 underline-offset-4">
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><User className="w-3 h-3" /> {vendor.ownerName || 'Generic Owner'}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {vendor.email || 'No Email'}</span>
                </div>
                <p className="text-sm text-slate-400 mt-3 line-clamp-2 italic leading-relaxed">
                  "{vendor.description || 'No description provided by the artisan.'}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
              {vendor.isApproved ? (
                <button 
                  onClick={() => handleApprove(vendor._id, false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
                >
                  <X className="w-4 h-4" /> Revoke Access
                </button>
              ) : (
                <button 
                  onClick={() => handleApprove(vendor._id, true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 dark:text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-yellow-400/20 transition-all"
                >
                  <Check className="w-4 h-4" /> Verify Artisan
                </button>
              )}
              <a 
                href={`/vendor/${vendor._id}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-gold-900/10 rounded-xl transition-all border border-transparent hover:border-gold-100"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="col-span-full p-20 text-center bg-white dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Store className="w-16 h-16 text-slate-200 dark:text-slate-700 dark:text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clean Queue</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Found zero vendors matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendors;
