import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, MapPin, Package, CheckCircle, ExternalLink, ShieldCheck, Store, X } from 'lucide-react';
import { productsService, reviewsService } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    console.log('Fetching product with ID:', id);
    productsService.getById(id).then(data => {
      console.log('Product fetched successfully:', data);
      setProduct(data);
      setLoading(false);
      return reviewsService.getProductReviews(id);
    }).then(revs => {
      setReviews(revs);
      setReviewsLoading(false);
    }).catch(err => {
      console.error('Failed to fetch details:', err);
      setLoading(false);
      setReviewsLoading(false);
    });
  }, [id]);

  const refreshReviews = () => {
    reviewsService.getProductReviews(id).then(setReviews);
  };

  const handleAdd = () => {
    addToCart({
      id: product._id,
      vendorId: product.vendorId?._id || product.vendorId,
      name: product.productName,
      price: product.price,
      image: product.images?.[0],
      quantity: qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading artisan craft...</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-24 flex flex-col items-center justify-center gap-4 text-center px-4">
      <div className="text-6xl mb-2">🔎</div>
      <h2 className="text-3xl font-bold dark:text-white">Product Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm">We couldn't find the piece you're looking for. It might have been removed or is temporarily unavailable.</p>
      <Link to="/shop" className="btn-primary mt-4">Back to Shop</Link>
    </div>
  );

  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=60';
  const vendor = product.vendorId;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="glass-card overflow-hidden aspect-square rounded-3xl group">
              <img src={image} alt={product.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary-500/20 blur-3xl -z-10" />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
            <span className="inline-block mb-3 text-sm font-bold text-primary-700 tracking-widest uppercase">{product?.category || 'Handcrafted'}</span>
            <h1 className="font-poppins font-black text-4xl sm:text-5xl dark:text-white mb-4 leading-tight">{product.productName}</h1>
            <span className="text-4xl font-bold text-slate-900 dark:text-white mb-8">{formatINR(product.price)}</span>

            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-10 text-lg">{product?.description || 'No description available for this unique piece.'}</p>

            {/* Vendor Mini Card */}
            {vendor && (
              <div className="mb-10 p-1 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-200 bg-white flex items-center justify-center shadow-sm">
                     {vendor?.profileImage ? (
                       <img src={vendor.profileImage} alt={vendor?.vendorName} className="w-full h-full object-cover" />
                     ) : (
                       <span className="text-xl font-bold text-primary-400">{vendor?.vendorName?.charAt(0)?.toUpperCase() || 'V'}</span>
                     )}
                  </div>
                  <div>
                    <Link to={`/vendor/${vendor._id}`} className="font-bold dark:text-white hover:text-primary-600 transition-colors flex items-center gap-1">
                      {vendor.vendorName} <ExternalLink className="w-3 h-3" />
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-tighter">
                      <MapPin className="w-3 h-3" /> {vendor.location}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8 bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 w-fit px-5 py-2.5 rounded-full">
              <Package className="w-4 h-4 text-slate-400" />
              <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} Units Available` : 'Out of stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center gap-6 mb-10">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Quantity</label>
                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-12 h-12 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-xl dark:text-white">−</button>
                  <span className="w-10 text-center text-base font-black dark:text-white">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-12 h-12 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-bold text-xl dark:text-white">+</button>
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`btn-primary w-full justify-center text-lg py-5 rounded-2xl shadow-xl shadow-primary-400/20 transition-all duration-300 ${added ? 'bg-green-500 !text-white' : ''}`}
            >
              {added ? (
                <><CheckCircle className="w-6 h-6 animate-pulse" /> Added to Cart!</>
              ) : (
                <><ShoppingBag className="w-6 h-6" /> Add to Cart</>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Detailed Vendor Profile Section */}
        {vendor && (
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="bg-primary-900 rounded-3xl p-8 md:p-12 mt-32 relative overflow-hidden shadow-primary-lg"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Store className="w-64 h-64 -mr-20 -mt-20" />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
                 <div className="md:col-span-1 flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-primary-800 shadow-xl mb-6 bg-slate-100 flex items-center justify-center">
                        {vendor?.profileImage ? (
                          <img src={vendor.profileImage} alt={vendor?.vendorName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-5xl font-bold text-primary-300">{vendor?.vendorName?.charAt(0)?.toUpperCase() || 'V'}</span>
                        )}
                    </div>
                    <Link to={`/vendor/${vendor._id}`} className="btn-secondary text-xs px-4 py-2 border-primary-700 hover:bg-primary-800 text-white hover:border-primary-600">Visit Shop</Link>
                 </div>
                 
                 <div className="md:col-span-3 space-y-6">
                    <div className="flex items-center gap-2 text-primary-400 font-bold uppercase tracking-widest text-sm">
                       <ShieldCheck className="w-4 h-4" /> Meet the Maker
                    </div>
                    <h2 className="text-3xl font-black text-white">{vendor.vendorName}</h2>
                    <p className="text-primary-200 text-lg leading-relaxed italic">
                      "{vendor.description}"
                    </p>
                    <div className="flex flex-wrap gap-6 pt-4 border-t border-primary-800">
                       <div className="flex items-center gap-2 text-sm text-primary-300">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span>{vendor.location}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}

        {/* Reviews Section */}
        <div className="mt-32">
          <ReviewSection 
            productId={id} 
            reviews={reviews} 
            loading={reviewsLoading} 
            onReviewAdded={refreshReviews} 
            user={user}
          />
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ productId, reviews, loading, onReviewAdded, user }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [media, setMedia] = useState('');
  const [mediaType, setMediaType] = useState('none');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await reviewsService.addReview({
        productId,
        rating,
        comment,
        media,
        mediaType
      });
      setComment('');
      setMedia('');
      setMediaType('none');
      setShowForm(false);
      onReviewAdded();
    } catch (err) {
      alert(err.message || 'Failed to add review. One review per product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result);
        setMediaType(type);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl font-black dark:text-white">Customer Reviews</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex text-primary-600">
               {[...Array(5)].map((_, i) => <span key={i} className="text-lg">★</span>)}
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">({reviews.length} total reviews)</span>
          </div>
        </div>
        {!showForm && user && (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)} className="btn-primary">
            Write a Review
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass-card p-8 mb-12 overflow-hidden bg-white/50 dark:bg-slate-800/50">
            <h3 className="text-xl font-bold dark:text-white mb-6">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setRating(s)} className={`text-3xl transition-colors ${s <= rating ? 'text-primary-600' : 'text-slate-300'}`}>★</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Review Content</label>
                <textarea 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  required 
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-4 focus:ring-primary-500/20 outline-none transition-all shadow-sm dark:text-white min-h-[120px]"
                  placeholder="What did you love about this piece? Every feedback helps our artisans."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Add Photo or Video</label>
                <input type="file" accept="image/*,video/*" onChange={handleMediaUpload} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-800 hover:file:bg-primary-100" />
                {media && (
                   <div className="mt-4 relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200">
                      {mediaType === 'video' ? <video src={media} className="w-full h-full object-cover" /> : <img src={media} className="w-full h-full object-cover" alt="Preview" />}
                      <button type="button" onClick={() => {setMedia(''); setMediaType('none');}} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3" /></button>
                   </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting} className="btn-primary px-8">{submitting ? 'Posting...' : 'Post Review'}</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-slate-500 hover:text-slate-700 dark:text-slate-200 dark:hover:text-slate-300">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(2)].map((_, i) => <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">No reviews yet. Be the first to share your experience!</div>
        ) : (
          reviews.map((rev, idx) => (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={rev._id} className="glass-card p-6 md:p-8">
              <div className="flex gap-4 items-start mb-4">
                <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-primary-700">
                  {rev.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold dark:text-white">{rev.user?.name || 'Anonymous User'}</h4>
                    <span className="text-xs text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-primary-600 text-sm mt-0.5">
                    {[...Array(5)].map((_, i) => <span key={i}>{i < rev.rating ? '★' : '☆'}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 italic">"{rev.comment}"</p>
              {rev.media && (
                <div className="mt-6 max-w-md rounded-2xl overflow-hidden shadow-lg">
                   {rev.mediaType === 'video' ? (
                     <video controls className="w-full h-auto max-h-[400px]">
                        <source src={rev.media} />
                     </video>
                   ) : (
                     <img src={rev.media} alt="Review media" className="w-full h-auto max-h-[400px] object-cover" />
                   )}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
