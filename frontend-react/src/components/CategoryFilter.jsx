import React from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All', 'Handmade Jewelry', 'Pottery', 'Wood Crafts', 'Paintings', 'Handmade Clothing', 'Home Decor', 'Traditional Art'];

const CategoryFilter = ({ active, onChange }) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {CATEGORIES.map(cat => (
      <motion.button
        key={cat}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => onChange(cat)}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          active === cat
            ? 'bg-gold-gradient text-slate-900 shadow-primary'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:text-primary-700'
        }`}
      >
        {cat}
      </motion.button>
    ))}
  </div>
);

export default CategoryFilter;
