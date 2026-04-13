import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=60';
  const vendor = product.vendorId;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({
      id: product._id,
      vendorId: vendor?._id || vendor,
      name: product.productName,
      price: product.price,
      image,
      quantity: 1,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-slate-900 overflow-hidden cursor-pointer flex flex-col rounded-3xl shadow-card hover:shadow-card-hover border border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          <img
            src={image}
            alt={product.productName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1541692641319-981cc79ee10a?auto=format&fit=crop&w=800&q=60'; // A very stable Unsplash craft placeholder
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-white/80 backdrop-blur-sm text-primary-700">
            {product.category}
          </span>

          {/* Quick actions */}
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-500 hover:shadow-primary transition-all duration-200"
              title="Add to cart"
            >
              <ShoppingBag className="w-4 h-4 text-slate-900 dark:text-white" />
            </button>
            <div className="w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-500 hover:shadow-primary transition-all duration-200">
              <Eye className="w-4 h-4 text-slate-900 dark:text-white" />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors duration-200 line-clamp-2 mb-1.5 text-lg">
            {product.productName}
          </h3>
          {vendor?.vendorName && (
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-4">
              <MapPin className="w-3.5 h-3.5 text-primary-400" />
              {vendor.vendorName} · {vendor.location || 'Global'}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-bold gradient-text">{formatINR(product.price)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.stock > 0 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
