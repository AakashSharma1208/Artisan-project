import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CheckCircle, CreditCard, Banknote, ArrowRight, X, AlertCircle, Loader2 } from 'lucide-react';
import { ordersService } from '../services/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderStatus, setOrderStatus] = useState({ state: 'idle', message: '' }); // idle | success | error

  // Manage body scroll lock
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-12 pb-20">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Checkout</h1>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-card border border-slate-100 dark:border-slate-800 text-center max-w-md w-full mx-4">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-slate-500 dark:text-slate-400 mb-6">Your cart is empty</h2>
          <button 
            onClick={() => navigate('/shop')} 
            className="w-full btn-primary py-3 justify-center text-lg font-bold"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleProceedToPayment = () => {
    setOrderStatus({ state: 'idle', message: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    if (isProcessing || orderStatus.state === 'success') return; // Don't close if loading or success
    setShowModal(false);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsProcessing(true);
      setOrderStatus({ state: 'idle', message: '' });

      // Sanitize input data to prevent errors
      const orderItems = cart.map(item => ({
        productId: item.id || '',
        vendorId: item.vendorId || '',
        quantity: item.quantity || 1,
        price: item.price || 0
      }));

      const payload = {
        products: orderItems,           // New structure
        orderItems: orderItems,         // Old structure (defensive fallback)
        totalAmount: totalPrice || 0,   // New structure
        totalPrice: totalPrice || 0,    // Old structure (defensive fallback)
        shippingAddress: { street: 'Demo St', city: 'Demo City', country: 'Demo Country' },
        paymentMethod,
        paymentStatus: paymentMethod === 'ONLINE' ? 'Paid' : 'Pending'
      };

      console.log('Outgoing Order Payload:', JSON.stringify(payload, null, 2));

      await ordersService.create(payload);

      setOrderStatus({
        state: 'success',
        message: paymentMethod === 'COD' ? 'Order placed successfully (Cash on Delivery)' : 'Payment successful & Order placed'
      });

      // Auto-redirect after success
      setTimeout(() => {
        clearCart();
        setShowModal(false);
        navigate('/shop');
      }, 3000);

    } catch (err) {
      console.error('Checkout error:', err);
      // If error is related to validation
      const errorMsg = err?.response?.data?.message || err?.message || '';
      if (errorMsg.toLowerCase().includes('vendorid') || errorMsg.toLowerCase().includes('validation failed')) {
        setOrderStatus({
          state: 'error',
          message: 'Order failed due to missing product details. Please try again.'
        });
      } else {
        setOrderStatus({
          state: 'error',
          message: 'Something went wrong. Please try again.'
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 pt-24 pb-20 dark:bg-slate-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black text-slate-900 dark:text-white mb-10 text-center lg:text-left"
        >
          Checkout <span className="gradient-text">Securely</span>
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-col-reverse lg:flex-row">
          
          {/* LEFT: Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col space-y-6"
          >
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[24px] shadow-card border border-slate-100 dark:border-slate-800 flex-1">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                Order Summary
              </h2>
              
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, index) => (
                  <div key={item.id || index} className="flex gap-4 p-4 border border-slate-100 dark:border-slate-800/50 rounded-[16px] bg-slate-50/50 dark:bg-slate-800/30">
                    <img 
                       src={item.image || "https://images.unsplash.com/photo-1513682121497-80211f36a790?auto=format&fit=crop&w=150&q=80"} 
                       alt={item.name || 'Product Image'} 
                       className="w-20 h-20 rounded-xl object-cover bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700" 
                    />
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">{item.name || 'Unknown Item'}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-2 py-1 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                          Qty: <span className="text-slate-800 dark:text-slate-200">{item.quantity || 1}</span>
                        </p>
                        <p className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                          ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Payment & Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-8 h-fit lg:sticky lg:top-28"
          >
            {/* Totals & Payment Form */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[24px] shadow-card border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold mb-5 text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                Cart Total
              </h2>

              <div className="mb-8">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 mb-3">
                  <span className="font-medium text-sm">Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 mb-5">
                  <span className="font-medium text-sm">Shipping</span>
                  <span className="font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-0.5 rounded-full text-xs">Free</span>
                </div>
                <div className="flex justify-between items-center flex-col sm:flex-row gap-2 text-2xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-lg font-bold">Total Pay</span>
                  <span className="text-primary-600 dark:text-primary-400 text-2xl">₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm tracking-wide uppercase">Payment Method</h3>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {/* COD Option */}
                <div 
                  onClick={() => setPaymentMethod('COD')}
                  className={`cursor-pointer border-2 rounded-xl p-3.5 flex items-center gap-3 transition-all duration-300 ${
                    paymentMethod === 'COD' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${paymentMethod === 'COD' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${paymentMethod === 'COD' ? 'text-primary-800 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      Cash on Delivery
                    </h4>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'COD' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                     {paymentMethod === 'COD' && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                </div>

                {/* Online Option */}
                <div 
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`cursor-pointer border-2 rounded-xl p-3.5 flex items-center gap-3 transition-all duration-300 ${
                    paymentMethod === 'ONLINE' 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${paymentMethod === 'ONLINE' ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm ${paymentMethod === 'ONLINE' ? 'text-primary-800 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      Online Payment
                    </h4>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'ONLINE' ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                     {paymentMethod === 'ONLINE' && <div className="w-2 h-2 rounded-full bg-primary-500" />}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleProceedToPayment}
                className="w-full btn-primary py-4 text-base font-bold justify-center shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all rounded-xl active:translate-y-0"
              >
                Proceed to Payment <ArrowRight className="w-5 h-5 ml-1.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Confirmation & Status Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
              onClick={closeModal} // Click outside to close
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white dark:bg-slate-900 rounded-[20px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 relative my-8"
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
              >
                {/* Close Button */}
                {(!isProcessing && orderStatus.state !== 'success') && (
                  <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}

                {/* Modal Content Switcher */}
                {orderStatus.state === 'success' ? (
                  /* Success State */
                  <div className="text-center py-4">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                      className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </motion.div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Order Confirmed!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
                      {orderStatus.message}
                    </p>
                    <div className="flex justify-center mt-2">
                      <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-sm bg-primary-50 dark:bg-primary-900/40 px-4 py-2.5 rounded-full border border-primary-100 dark:border-primary-800">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to Shop...
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Confirmation State */
                  <div className="py-2">
                    <div className="mb-6 text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Confirm Payment</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Please review your choice before finalizing the order.
                      </p>
                    </div>

                    {orderStatus.state === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex flex-col gap-3 mb-6"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium">{orderStatus.message}</span>
                        </div>
                        <button 
                          onClick={() => setOrderStatus({ state: 'idle', message: '' })}
                          className="self-end text-xs font-bold bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 px-3 py-1.5 rounded-lg transition-colors border border-red-200 dark:border-red-800"
                        >
                          Retry
                        </button>
                      </motion.div>
                    )}

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Payment Method</span>
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm text-sm">
                          {paymentMethod === 'COD' ? <Banknote className="w-4 h-4 text-green-500" /> : <CreditCard className="w-4 h-4 text-blue-500" />}
                          {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-4">
                        <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">Amount to pay</span>
                        <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                          ₹{(totalPrice || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                      <button 
                        onClick={closeModal}
                        disabled={isProcessing}
                        className="flex-1 py-3.5 px-4 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 text-center"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleConfirmOrder}
                        disabled={isProcessing}
                        className="flex-[2] btn-primary py-3.5 flex items-center justify-center gap-2 rounded-xl disabled:opacity-80 transition-all font-bold group"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            Confirm & Pay
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CheckoutPage;
