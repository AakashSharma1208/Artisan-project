import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sun, Moon, Menu, X, Sparkles, Store, LayoutDashboard, LogOut, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setUserMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const role = user?.role;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl py-3 shadow-lg border-b border-slate-200 dark:border-slate-800' 
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-5 border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <Sparkles className="w-6 h-6 text-primary-500" />
          <span className="font-poppins font-bold text-2xl gradient-text">Artisan</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8 px-4">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to}
              className={`relative font-medium text-sm transition-colors duration-200 group ${
                location.pathname === l.to
                  ? 'text-primary-600'
                  : darkMode ? 'text-slate-200 hover:text-primary-500' : 'text-slate-700 hover:text-primary-600'
              }`}
            >
              {l.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${location.pathname === l.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}

          {/* Vendor-specific nav link */}
          {user && role === 'user' && (
            <Link to="/vendor/register"
              className="flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-600 transition-colors"
            >
              <Store className="w-4 h-4" />
              Become a Vendor
            </Link>
          )}
          {user && role === 'vendor' && (
            <Link to="/vendor/dashboard"
              className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/vendor/dashboard') ? 'text-primary-600' : 'text-slate-700 dark:text-slate-100 hover:text-primary-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Vendor Dashboard
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Dark mode */}
          <button onClick={() => setDarkMode(d => !d)}
            className={`p-2 rounded-full transition-all hidden sm:block ${darkMode ? 'bg-slate-800 text-primary-500 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-primary-100'}`}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className={`w-5 h-5 ${darkMode ? 'text-slate-200' : 'text-slate-700'} hover:text-primary-600 transition-colors`} />
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-slate-900 dark:text-white text-xs font-bold flex items-center justify-center">
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* User menu / Auth buttons */}
          {user ? (
            <div className="hidden md:block relative">
              <button onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-all text-sm font-medium dark:text-slate-200"
              >
                <User className="w-4 h-4 text-primary-500" />
                {user.name?.split(' ')[0] || 'Account'}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 glass-card p-1 shadow-lg rounded-2xl overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-sm dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role} account</p>
                    </div>
                    {role === 'user' && (
                      <Link to="/vendor/register" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-slate-800 text-primary-700 font-medium rounded-xl transition-colors">
                        <Store className="w-4 h-4" /> Become a Vendor
                      </Link>
                    )}
                    {role === 'vendor' && (
                      <Link to="/vendor/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-primary-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Vendor Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl transition-colors">
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors dark:text-slate-300">Login</Link>
              <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">Join Free</Link>
            </div>
          )}

          {/* Mobile menu */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-t border-white/20 px-6 py-4 flex flex-col gap-3"
          >
            {navLinks.map(l => (
              <Link key={l.to} to={l.to} className="font-medium py-2 border-b border-slate-100 dark:border-slate-700 dark:text-white">{l.label}</Link>
            ))}
            {user ? (
              <>
                <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">Signed in as {user.name}</p>
                {role === 'user' && (
                  <Link to="/vendor/register" className="text-primary-700 font-semibold py-2 flex items-center gap-2"><Store className="w-4 h-4" /> Become a Vendor</Link>
                )}
                {role === 'vendor' && (
                  <Link to="/vendor/dashboard" className="py-2 flex items-center gap-2 dark:text-white"><LayoutDashboard className="w-4 h-4" /> Vendor Dashboard</Link>
                )}
                <button onClick={handleLogout} className="text-left text-red-500 py-2 flex items-center gap-2"><LogOut className="w-4 h-4" /> Log Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 font-medium dark:text-white">Login</Link>
                <Link to="/signup" className="btn-primary text-center py-3">Join Free</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
