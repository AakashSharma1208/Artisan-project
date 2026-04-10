import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Plus, Edit2, Trash2, ShoppingBag,
  TrendingUp, Eye, X, Check, AlertCircle, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productsService, vendorService, ordersService } from '../services/api';
import { formatINR } from '../utils/formatters';
import ImageUpload from '../components/ImageUpload';

const CATEGORIES = ['Handmade Jewelry','Pottery','Wood Crafts','Paintings','Handmade Clothing','Home Decor','Traditional Art'];

const StatCard = ({ icon, label, value, color }) => (
  <motion.div whileHover={{ y: -4 }} className="glass-card p-6">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
      {icon}
    </div>
    <p className="text-2xl font-bold dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
  </motion.div>
);

const VendorDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const [productForm, setProductForm] = useState({
    productName: '', description: '', price: '', category: CATEGORIES[0], stock: '', images: ['']
  });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'vendor') { navigate('/vendor/register'); return; }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    console.log('Fetching vendor dashboard data...');
    try {
      const vendorData = await vendorService.getProfile();
      console.log('Vendor Data:', vendorData);

      if (!vendorData || !vendorData._id) {
        throw new Error('Invalid vendor profile. Please re-login.');
      }

      const prods = await productsService.getAll();
      console.log('All Products Received:', prods.length);
      
      setVendor(vendorData);
      // Filter to only this vendor's products
      const filtered = prods.filter(p => {
        const vid = p.vendorId?._id || p.vendorId;
        return vid?.toString() === vendorData._id?.toString();
      });
      console.log('Filtered Vendor Products:', filtered.length);
      setProducts(filtered);
    } catch (err) {
      console.error('Core data fetch error:', err);
      showToast(err.message || 'Failed to load vendor data.', 'error');
      if (err.message?.includes('authorization') || err.message?.includes('authorized')) {
          navigate('/vendor/register');
      }
    }

    try {
      const myOrders = await ordersService.getVendorOrders();
      console.log('Vendor Orders Received:', myOrders.length);
      setOrders(myOrders);
    } catch (err) {
      console.error('Orders fetch error:', err);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const resetForm = () => {
    setProductForm({ productName: '', description: '', price: '', category: CATEGORIES[0], stock: '', images: [''] });
    setEditingProduct(null);
    setShowForm(false);
  };

  const openEdit = (p) => {
    setProductForm({
      productName: p.productName,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      images: p.images?.length ? p.images : [''],
    });
    setEditingProduct(p);
    setShowForm(true);
    setTab('products');
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...productForm,
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        images: productForm.images.filter(Boolean),
      };
      if (editingProduct) {
        await productsService.update(editingProduct._id, body);
        showToast('Product updated!');
      } else {
        await productsService.create(body);
        showToast('Product created!');
      }
      resetForm();
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to save product.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsService.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      setDeleteId(null);
      showToast('Product deleted.');
    } catch (err) {
      showToast(err.message || 'Failed to delete.', 'error');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-950">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-lg flex items-center gap-3 text-sm font-medium ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold-200 shadow-sm">
               <img src={vendor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor?.vendorName || 'Shop')}&background=e2e8f0&color=94a3b8&size=128`} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-primary-600 text-sm font-semibold uppercase tracking-widest mb-1">Vendor Dashboard</p>
              <div className="flex items-center gap-3">
                <h1 className="font-poppins font-bold text-3xl dark:text-white">{vendor?.vendorName || 'My Shop'}</h1>
                <button 
                  onClick={() => navigate('/vendor/profile')}
                  className="p-1.5 hover:bg-primary-50 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-gold-200 group"
                  title="Edit Profile"
                >
                  <Edit2 className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                </button>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{vendor?.location}</p>
            </div>
          </div>
          {tab === 'products' && (
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => { resetForm(); setShowForm(true); }}
              className="btn-primary px-6 py-3 text-sm flex-shrink-0">
              <Plus className="w-4 h-4" /> Add Product
            </motion.button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-slate-900 p-1.5 rounded-2xl w-fit shadow-sm">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setShowForm(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                tab === t.key ? 'bg-gold-gradient text-slate-900 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard icon={<Package className="w-6 h-6 text-white" />} label="Total Products" value={products.length} color="bg-blue-500" />
              <StatCard icon={<ShoppingBag className="w-6 h-6 text-white" />} label="Total Orders" value={orders.length} color="bg-green-500" />
              <StatCard icon={<TrendingUp className="w-6 h-6 text-white" />} label="Total Revenue" value={formatINR(orders.reduce((s, o) => s + (o.totalPrice || 0), 0))} color="bg-primary-500" />
              <StatCard icon={<Eye className="w-6 h-6 text-white" />} label="In Stock" value={products.filter(p => p.stock > 0).length} color="bg-purple-500" />
            </div>

            <div className="glass-card p-6">
              <h3 className="font-poppins font-semibold text-lg dark:text-white mb-5">Your Products</h3>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No products yet. Add your first product!</p>
                  <button onClick={() => { setTab('products'); setShowForm(true); }} className="btn-primary mt-5 text-sm px-6 py-2.5"><Plus className="w-4 h-4" /> Add Product</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.slice(0, 6).map((p, i) => (
                    <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:shadow-md transition-shadow">
                      <img src={p.images?.[0]} alt={p.productName} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" onError={e => e.target.src = 'https://via.placeholder.com/56'} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm dark:text-white truncate">{p.productName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{formatINR(p.price)} · {p.stock} in stock</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Add/Edit Form */}
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-6 sm:p-8 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-poppins font-semibold text-xl dark:text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={resetForm} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[['productName', 'Product Name', 'text'], ['price', 'Price', 'number'], ['stock', 'Stock', 'number']].map(([key, label, type]) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</label>
                        <input type={type} value={productForm[key]} onChange={e => setProductForm(f => ({ ...f, [key]: e.target.value }))} required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-primary-500 transition-all" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                      <select value={productForm.category} onChange={e => setProductForm(f => ({ ...f, category: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-primary-500 transition-all">
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                       <ImageUpload 
                        label="Product Image" 
                        value={productForm.images[0]} 
                        onChange={(val) => setProductForm(f => ({ ...f, images: [val] }))} 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
                      <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-primary-500 transition-all resize-none" />
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                      <motion.button type="submit" whileHover={{ scale: 1.02 }} className="btn-primary px-8 py-3 text-sm">
                        {editingProduct ? 'Save Changes' : 'Add Product'}
                      </motion.button>
                      <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors dark:text-slate-300">
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Products Table */}
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden sm:table-cell">Category</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Stock</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-16 text-slate-500 dark:text-slate-400">No products yet. Click "Add Product" to get started.</td></tr>
                  ) : products.map((p, i) => (
                    <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0]} alt={p.productName} className="w-12 h-12 object-cover rounded-xl" onError={e => e.target.src = 'https://via.placeholder.com/48'} />
                          <span className="font-medium text-sm dark:text-white line-clamp-1">{p.productName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 hidden sm:table-cell">{p.category}</td>
                      <td className="px-6 py-4 text-sm font-semibold gradient-text">{formatINR(p.price)}</td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{p.stock}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button onClick={() => openEdit(p)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 rounded-xl transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(p._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400">No orders yet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800">
                    {['Order ID', 'Customer', 'Products', 'Total', 'Status', 'Date'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={o._id} className="border-b border-slate-50 dark:border-slate-800/50">
                      <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400">{o._id?.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm font-medium dark:text-slate-300">{o.userId?.name || 'Customer'}</td>
                      <td className="px-6 py-4 text-sm dark:text-slate-300">
                        <div className="space-y-1">
                          {o.products?.map((p, idx) => (
                            <div key={idx} className="text-xs flex flex-col">
                               <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.productId?.productName || 'Unknown Product'}</span> 
                               <span className="text-slate-500 dark:text-slate-400">Qty: {p.quantity} · {formatINR(p.price)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold gradient-text">{formatINR(o.totalPrice)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="glass-card p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}>
              <Trash2 className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="font-poppins font-bold text-xl dark:text-white mb-2">Delete Product?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-sm dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="px-6 py-2.5 rounded-full bg-red-500 text-white text-sm hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboardPage;
