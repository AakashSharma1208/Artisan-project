import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CartPage from './pages/CartPage';
import VendorRegisterPage from './pages/VendorRegisterPage';
import VendorDashboardPage from './pages/VendorDashboardPage';
import VendorProfileEdit from './pages/VendorProfileEdit';
import PublicVendorProfilePage from './pages/PublicVendorProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

// Admin Imports
import AdminLayout from './components/AdminLayout';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import ScrollToTop from './components/ScrollToTop';

import AnimatedPage from './components/AnimatedPage';

const App = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('token', token);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload?.role) localStorage.setItem('userRole', payload.role);
      } catch (err) {
        console.error('Error decoding auth token:', err);
      }
      // Clean URL and force reload state
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    } else if (error) {
      console.error('OAuth Error:', error);
      alert('OAuth Error: ' + error);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Auth pages – no nav/footer */}
            <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
            <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />

            {/* Admin Section - Protected by AdminRoute */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
              <Route path="users" element={<AnimatedPage><AdminUsers /></AnimatedPage>} />
              <Route path="vendors" element={<AnimatedPage><AdminVendors /></AnimatedPage>} />
              <Route path="products" element={<AnimatedPage><AdminProducts /></AnimatedPage>} />
              <Route path="orders" element={<AnimatedPage><AdminOrders /></AnimatedPage>} />
            </Route>

            {/* Main app */}
            <Route element={<Layout darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
              <Route path="/shop" element={<AnimatedPage><ShopPage /></AnimatedPage>} />
              <Route path="/product/:id" element={<AnimatedPage><ProductDetailPage /></AnimatedPage>} />
              <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
              <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
              <Route path="/vendor/register" element={<AnimatedPage><VendorRegisterPage /></AnimatedPage>} />
              <Route path="/vendor/dashboard" element={<AnimatedPage><VendorDashboardPage /></AnimatedPage>} />
              <Route path="/vendor/profile" element={<AnimatedPage><VendorProfileEdit /></AnimatedPage>} />
              <Route path="/vendor/:id" element={<AnimatedPage><PublicVendorProfilePage /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
              <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
              <Route path="/privacy" element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
              <Route path="/terms" element={<AnimatedPage><TermsOfServicePage /></AnimatedPage>} />
            </Route>
          </Routes>
        </AnimatePresence>

      </CartProvider>
    </AuthProvider>
  );
};

export default App;
