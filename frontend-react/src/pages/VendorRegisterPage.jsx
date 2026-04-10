import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Phone, FileText, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vendorService } from '../services/api';
import ImageUpload from '../components/ImageUpload';

const VendorRegisterPage = () => {
  const [form, setForm] = useState({ 
    vendorName: '', description: '', location: '', address: '', phone: '', profileImage: '', bannerImage: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user, upgradeToVendor } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.vendorName.trim()) { setError('Shop name is required.'); return; }
    if (!form.phone.trim()) { setError('Contact Number is required.'); return; }
    if (!form.address.trim()) { setError('Full Address is required.'); return; }
    setLoading(true); setError('');
    try {
      const data = await vendorService.register(form);
      upgradeToVendor(data?.user, data?.token);
      setSuccess(true);
      setTimeout(() => navigate('/vendor/dashboard'), 2000);
    } catch (err) {
      if (err.message && err.message.toLowerCase().includes('already')) {
        navigate('/vendor/dashboard');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const inputClass = "w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-gold-200 dark:focus:ring-gold-900 transition-all bg-white";

  if (success) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12">
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="w-24 h-24 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-slate-900 dark:text-white" />
        </motion.div>
        <h2 className="font-poppins font-bold text-3xl dark:text-white mb-3">You're now a Vendor! 🎉</h2>
        <p className="text-slate-500 dark:text-slate-400">Redirecting you to your dashboard...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left – Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Vendor Programme</span>
            </div>
            <h1 className="font-poppins font-black text-4xl sm:text-5xl dark:text-white leading-tight mb-6">
              Start Selling Your <span className="gradient-text">Creations</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-10">
              Join thousands of talented artisans sharing their craft on Artisan. Set up your shop in minutes and start reaching customers worldwide.
            </p>
            <div className="space-y-5">
              {[
                { icon: '🛍️', title: 'Your Own Store', desc: 'A dedicated shop page showcasing all your products.' },
                { icon: '📊', title: 'Vendor Dashboard', desc: 'Manage products, track views, and monitor orders.' },
                { icon: '🌍', title: 'Worldwide Reach', desc: 'Connect with buyers from around the globe.' },
                { icon: '💰', title: 'Keep More Earnings', desc: 'Low platform fees — you keep the majority of every sale.' },
              ].map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4 glass-card p-5">
                  <span className="text-2xl flex-shrink-0">{b.icon}</span>
                  <div>
                    <p className="font-semibold dark:text-white">{b.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{b.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right – Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="glass-card p-8 sm:p-10">
              <h2 className="font-poppins font-bold text-2xl dark:text-white mb-2">Set Up Your Shop</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Signed in as <span className="font-medium text-primary-600">{user?.email}</span></p>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <ImageUpload 
                  label="Shop Banner Image" 
                  value={form.bannerImage} 
                  previewType="banner"
                  onChange={(val) => setForm(f => ({ ...f, bannerImage: val }))} 
                />

                <ImageUpload 
                  label="Shop Logo / Profile Image" 
                  value={form.profileImage} 
                  previewType="profile"
                  onChange={(val) => setForm(f => ({ ...f, profileImage: val }))} 
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Shop Name *</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={form.vendorName} onChange={set('vendorName')} required placeholder="e.g. Sunrise Pottery Studio" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Shop Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <textarea value={form.description} onChange={set('description')} placeholder="Tell buyers what makes your shop special..." rows={4}
                      className={`${inputClass} pl-11 pt-4 resize-none`} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Contact Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="tel" value={form.phone} onChange={set('phone')} required placeholder="+91 9876543210" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={form.location} onChange={set('location')} placeholder="City, State" className={inputClass} />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Full Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" value={form.address} onChange={set('address')} required placeholder="123 Artisan Street, Block B" className={inputClass} />
                    </div>
                  </div>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base mt-2 disabled:opacity-60">
                  {loading
                    ? <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    : <><span>Launch My Shop</span><ArrowRight className="w-5 h-5" /></>
                  }
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
