import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Trash2, 
  Edit3, 
  Plus, 
  Filter,
  CheckCircle2,
  AlertCircle,
  Tag,
  IndianRupee,
  User as UserIcon
} from 'lucide-react';
import { adminService } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [newProduct, setNewProduct] = useState({
    vendorEmail: '',
    name: '',
    price: '',
    description: '',
    category: '',
    images: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setFeedback({ type: 'error', message: 'Failed to load product catalog.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product from Artisan?')) return;
    try {
      await adminService.deleteProduct(id);
      setProducts(products.filter(p => p._id !== id));
      setFeedback({ type: 'success', message: 'Product successfully removed.' });
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to delete product.' });
    }
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await adminService.addProduct(newProduct);
      setFeedback({ type: 'success', message: 'Product added successfully!' });
      setIsAddModalOpen(false);
      fetchProducts();
      setNewProduct({ vendorEmail: '', name: '', price: '', description: '', category: '', images: [] });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add product.' });
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const filteredProducts = products.filter(p => {
    const name = (p.name || '').toLowerCase();
    const category = (p.category || '').toLowerCase();
    const searchTerm = search.toLowerCase();
    return name.includes(searchTerm) || category.includes(searchTerm);
  });

  if (loading) return <div className="h-96 flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Global Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and manage all handcrafted goods.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Add Master Product
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search catalog..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 dark:text-white"
          />
        </div>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 border ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10'}`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group font-poppins">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={p.images?.[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-primary-700 dark:text-primary-500">₹{p.price}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 text-sm">
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-950 rounded-3xl p-8 w-full max-w-xl shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 italic tracking-tight">
              <Package className="w-6 h-6 text-primary-600" />
              ADD NEW MASTER PRODUCT
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor Email (Existing User)</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" required placeholder="owner@artisan.com" value={newProduct.vendorEmail} onChange={e => setNewProduct({...newProduct, vendorEmail: e.target.value})}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-primary-500 rounded-2xl text-sm transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input type="text" required placeholder="Luxury Pottery" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-primary-500 rounded-2xl text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input type="number" required placeholder="99.99" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-primary-500 rounded-2xl text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                <input type="text" required placeholder="Home Decor" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-primary-500 rounded-2xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea rows="3" required placeholder="Detailed item description..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-primary-500 rounded-2xl text-sm resize-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-4 bg-primary-500 hover:bg-primary-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all">Create Product</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
