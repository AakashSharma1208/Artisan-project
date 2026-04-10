import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ value, onChange, label = "Image", previewType = "banner" }) => {
  const [mode, setMode] = useState('url'); // 'url' or 'file'
  const [preview, setPreview] = useState(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (val) => {
    setPreview(val);
    onChange(val);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">{label}</label>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${mode === 'url' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-700 font-bold' : 'text-slate-500'}`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode('file')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${mode === 'file' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-700 font-bold' : 'text-slate-500'}`}
          >
            Upload
          </button>
        </div>
      </div>

      <div className="relative group">
        {mode === 'url' ? (
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={value || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all dark:text-white"
            />
          </div>
        ) : (
          <div className="relative h-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 transition-colors bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Upload className="w-4 h-4 text-primary-600" />
              <span>Click to upload file</span>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="preview-container"
          >
            <div className="relative inline-block border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
              <img 
                src={preview} 
                alt="Preview" 
                className={previewType === 'banner' ? 'banner-preview-fixed' : 'profile-preview-fixed'} 
              />
              <button 
                type="button"
                onClick={() => { setPreview(''); onChange(''); }}
                className="remove-btn-top"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            {previewType === 'profile' && (
               <div className="hidden md:block">
                 <p className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-1">Preview</p>
                 <div className="w-16 h-16 rounded-full border-2 border-primary-500 overflow-hidden shadow-sm">
                   <img src={preview} alt="Circular Preview" className="w-full h-full object-cover" />
                 </div>
               </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
