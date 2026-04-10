import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, MapPin, Phone, Store, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vendorService } from '../services/api';
import ImageUpload from '../components/ImageUpload';
import { validateIndianPhone } from '../utils/formatters';
import { Check } from 'lucide-react';

const VendorProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vendorData, setVendorData] = useState({
    vendorName: '',
    description: '',
    location: '',
    address: '',
    phone: '',
    profileImage: '',
    bannerImage: ''
  });
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      navigate('/login');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await vendorService.getProfile();
      setVendorData({
        vendorName: data.vendorName || '',
        description: data.description || '',
        location: data.location || '',
        address: data.address || '',
        phone: data.phone || '',
        profileImage: data.profileImage || '',
        bannerImage: data.bannerImage || ''
      });
    } catch (err) {
      console.error("Profile Error:", err.response?.data || err.message);
      setLoadError('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess('');

    if (!validateIndianPhone(vendorData.phone)) {
      setSubmitError('Please enter a valid 10-digit Indian phone number.');
      return;
    }

    setSaving(true);
    try {
      await vendorService.updateProfile(vendorData);
      setSuccess('Profile updated successfully! Redirecting...');
      setTimeout(() => navigate('/vendor/dashboard'), 1500);
    } catch (err) {
      setSubmitError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 flex items-center justify-center animate-pulse text-primary-600 font-medium italic">Handcrafting your experience...</div>;
  if (loadError) return <div className="min-h-screen pt-24 flex items-center justify-center text-red-500 font-medium">{loadError}</div>;
  if (!vendorData.vendorName && !loading) return <div className="min-h-screen pt-24 flex items-center justify-center text-slate-500 dark:text-slate-400 font-medium">No vendor profile found. Please register as a vendor.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden">
          <div className="header-section">
            {vendorData.profileImage ? (
              <img src={vendorData.profileImage} alt="Profile" className="profile-image-fixed object-cover bg-white" />
            ) : (
              <div className="profile-image-fixed flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md">
                <span className="text-4xl font-bold text-slate-400">{vendorData.vendorName?.charAt(0)?.toUpperCase() || 'S'}</span>
              </div>
            )}
            <div className="header-text-fixed">
              <h1 className="title-fixed gradient-text">Edit Shop Profile</h1>
              <p className="subtitle-fixed">Update your brand identity and contact information.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8">
            {/* --- BRANDING SECTION --- */}
            <div className="section-card">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Store className="w-5 h-5 text-primary-600" /> Branding & Identity
              </h3>
              
              <div className="space-y-8">
                <ImageUpload 
                  label="Shop Banner Image" 
                  value={vendorData.bannerImage} 
                  previewType="banner"
                  onChange={(val) => setVendorData({...vendorData, bannerImage: val})} 
                />

                <ImageUpload 
                  label="Shop Logo / Profile Image" 
                  value={vendorData.profileImage} 
                  previewType="profile"
                  onChange={(val) => setVendorData({...vendorData, profileImage: val})} 
                />

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shop Name</label>
                  <input
                    type="text"
                    value={vendorData.vendorName}
                    onChange={(e) => setVendorData({...vendorData, vendorName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Shop Description</label>
                  <textarea
                    value={vendorData.description}
                    onChange={(e) => setVendorData({...vendorData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* --- CONTACT & LOCATION SECTION --- */}
            <div className="section-card">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <MapPin className="w-5 h-5 text-primary-600" /> Contact & Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary-600" /> Contact Number (India)
                  </label>
                  <input
                    type="text"
                    placeholder="+91 or 10 digits"
                    value={vendorData.phone}
                    onChange={(e) => setVendorData({...vendorData, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">City / Location</label>
                  <input
                    type="text"
                    value={vendorData.location}
                    onChange={(e) => setVendorData({...vendorData, location: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>

                <div className="space-y-2 col-span-2 md:col-span-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Detailed Address</label>
                  <input
                    type="text"
                    value={vendorData.address}
                    onChange={(e) => setVendorData({...vendorData, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
                  />
                </div>
              </div>
            </div>

            {submitError && <p className="mt-4 text-red-500 text-sm font-medium flex items-center gap-1"> {submitError}</p>}
            {success && <p className="mt-4 text-green-500 text-sm font-medium flex items-center gap-1"><Check className="w-4 h-4" /> {success}</p>}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-12 py-4 text-lg justify-center gap-3 shadow-xl shadow-primary-400/20"
              >
                {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorProfileEdit;
