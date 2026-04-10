import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageSquare, ShoppingBag, Store } from 'lucide-react';
import { vendorService } from '../services/api';
import ProductCard from '../components/ProductCard';

const PublicVendorProfilePage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("Fetching vendor with ID:", id);
    if (!id) {
      setError('Invalid Vendor ID');
      setLoading(false);
      return;
    }
    vendorService.getVendorById(id)
      .then(res => {
        console.log("Vendor API response:", res);
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching vendor:", err);
        setError('Vendor not found or server error');
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 pt-24">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-lg font-medium">Visiting Artisan Studio...</p>
    </div>
  );

  if (error || !data || !data.vendor) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-6 text-center px-4 pt-24">
      <div className="text-6xl">🎨</div>
      <h2 className="text-3xl font-bold dark:text-white">{error || 'Vendor Not Found'}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">
        We couldn't find the studio you're looking for. It might have moved or is temporarily closed.
      </p>
      <Link to="/shop" className="btn-primary">Explore Other Artists</Link>
    </div>
  );

  const vendor = data?.vendor;
  const products = data?.products || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="h-48 md:h-64 relative">
             {vendor.bannerImage ? (
              <img 
                src={vendor.bannerImage} 
                alt="Shop Banner" 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900" />
            )}
             <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="px-8 pb-10">
            <div className="relative flex flex-col md:flex-row gap-8 items-end w-full -mt-20">
              <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl bg-white flex items-center justify-center">
                {vendor.profileImage ? (
                  <img src={vendor.profileImage} alt={vendor.vendorName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold text-slate-300">{vendor.vendorName?.charAt(0)?.toUpperCase() || 'V'}</span>
                )}
              </div>
              <div className="flex-1 pb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary-700 bg-primary-50 dark:bg-gold-900/30 px-3 py-1 rounded-full mb-3">
                  Verified Artisan
                </span>
                <h1 className="text-4xl md:text-5xl font-black gradient-text mb-2">{vendor?.vendorName}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-primary-600" /> {vendor?.location}</span>
                  <span className="flex items-center gap-1"><Store className="w-4 h-4 text-primary-600" /> Member since {vendor?.createdAt ? new Date(vendor.createdAt).getFullYear() : '2024'}</span>
                </div>
              </div>
              <div className="flex gap-3 pb-2">
                 <button className="btn-primary flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Message</button>
              </div>
            </div>
            
            <div className="w-full mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
              <div className="lg:col-span-2">
                <h2 className="text-lg font-bold dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight text-slate-500 dark:text-slate-400">About the Studio</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                  "{vendor.description}"
                </p>
              </div>
              <div className="glass-card bg-white/40 dark:bg-slate-900/40 p-6 self-start space-y-4">
                 <h2 className="text-sm font-bold uppercase text-slate-400">Business Details</h2>
                  <div className="space-y-3 text-sm">
                     <p className="dark:text-white font-medium text-slate-700 dark:text-slate-200"><span className="text-slate-500 dark:text-slate-400">Contact:</span> {vendor?.phone}</p>
                     <p className="dark:text-white font-medium text-slate-700 dark:text-slate-200"><span className="text-slate-500 dark:text-slate-400">Address:</span> {vendor?.address || 'Standard Shipping'}</p>
                  </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
           <h2 className="text-2xl font-black dark:text-white flex items-center gap-3">
             <ShoppingBag className="w-6 h-6 text-primary-600" /> 
             Shop Collection 
             <span className="text-sm font-normal text-slate-400 ml-2">({products.length} Items)</span>
           </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicVendorProfilePage;
