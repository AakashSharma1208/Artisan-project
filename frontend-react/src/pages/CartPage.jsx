import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';

const CartPage = () => {
  const { cart, removeFromCart, updateQty, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 dark:bg-slate-950">
      <div className="text-8xl">🛒</div>
      <h2 className="text-2xl font-bold dark:text-white">Your cart is empty</h2>
      <p className="text-slate-500 dark:text-slate-400">Looks like you haven't added anything yet.</p>
      <Link to="/shop" className="btn-primary"><ShoppingBag className="w-4 h-4" /> Browse Products</Link>
    </div>
  );

  const tax = totalPrice * 0.05;
  const total = totalPrice + tax;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-poppins font-bold text-3xl dark:text-white mb-8">
          Shopping <span className="gradient-text">Cart</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} exit={{ opacity: 0, x: 20 }}
                className="glass-card flex items-center gap-4 p-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold dark:text-white truncate">{item.name}</p>
                  <p className="text-primary-600 font-bold mt-1">{formatINR(item.price)}</p>
                </div>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden">
                  <button onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <p className="font-bold text-slate-800 dark:text-white w-20 text-right">{formatINR(item.price * item.quantity)}</p>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 h-fit sticky top-28">
            <h3 className="font-poppins font-bold text-xl dark:text-white mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax (5%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between font-bold text-base dark:text-white">
                <span>Total</span>
                <span className="gradient-text">{formatINR(total)}</span>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheckout}
              className="btn-primary w-full justify-center mt-6 py-4">
              Checkout <ArrowRight className="w-4 h-4" />
            </motion.button>
            <Link to="/shop" className="block text-center text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 mt-4 transition-colors">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
