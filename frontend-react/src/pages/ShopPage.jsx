import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import CategoryFilter from '../components/CategoryFilter';
import { productsService } from '../services/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (debouncedSearch) params.keyword = debouncedSearch;
    productsService.getAll(params).then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCategory, debouncedSearch]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    if (cat !== 'All') setSearchParams({ category: cat });
    else setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 mb-8 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-poppins font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-3">
            Artisan <span className="gradient-text">Shop</span>
          </motion.h1>
          <p className="text-slate-500 dark:text-slate-400">Explore {products.length}+ handcrafted products</p>

          {/* Search */}
          <div className="mt-8 relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search for jewelry, pottery, paintings..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 pb-20">
        {/* Category filter */}
        <div className="mb-10">
          <CategoryFilter active={activeCategory} onChange={handleCategory} />
        </div>

        {/* Results count */}
        {!loading && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Showing {products.length} results {activeCategory !== 'All' && `in "${activeCategory}"`}
          </motion.p>
        )}

        {/* Grid */}
        {loading ? (
          <SkeletonGrid count={8} />
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No products found</h3>
            <p className="text-slate-500 dark:text-slate-500 dark:text-slate-400">Try adjusting your filters or search terms</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
