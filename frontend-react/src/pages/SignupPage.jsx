import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// Safe Google Button Component
const GoogleSignInButton = () => {
  return (
    <>
      <motion.a
        href="http://localhost:5000/auth/google"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all text-sm font-semibold text-slate-700 dark:text-slate-200 mb-6"
      >
        <GoogleIcon />
        Continue with Google
      </motion.a>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">or sign up with email</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>
    </>
  );
};

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { 
      setError('Password must be at least 6 characters.'); 
      return; 
    }
    setLoading(true); 
    setError('');
    
    try {
      await signup(form);
      navigate('/');
    } catch (err) {
      console.error('Manual Signup Error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const inputClass = "w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-sm";

  // CRITICAL: Always return JSX. 
  // No branch should return null or undefined for the main page.
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <div className="hidden lg:flex lg:w-1/2 bg-primary-900 relative overflow-hidden items-center justify-center p-16">
        <div className="absolute inset-0 opacity-30 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-950/80 via-primary-900/50 to-transparent" />
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary-500/20 blur-[100px]" />
        <div className="relative z-10 text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary-400" />
            <span className="font-poppins font-black text-4xl text-white tracking-tight">Artisan</span>
          </div>
          <h2 className="font-poppins font-bold text-3xl text-white">Join Our Community</h2>
          <p className="text-primary-200 max-w-xs mx-auto text-lg leading-relaxed">Shop unique handcrafted goods — or start your own artisan store.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl shadow-card border border-slate-100 dark:border-slate-800">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
            <Sparkles className="w-8 h-8 text-primary-500" />
            <span className="font-poppins font-black text-3xl text-slate-900 dark:text-white">Artisan</span>
          </div>

          <h1 className="font-poppins font-bold text-3xl dark:text-white mb-1">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Already a member? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-3 rounded-xl text-sm mb-5 border border-red-200">
              {error}
            </motion.div>
          )}

          {/* Defensively render Google button */}
          {GOOGLE_CLIENT_ID ? (
            <GoogleSignInButton />
          ) : (
            <div className="hidden" /> 
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={form.name} onChange={set('name')} required placeholder="Full name" className={inputClass} />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={form.email} onChange={set('email')} required placeholder="Email address" className={inputClass} />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Password (min 6 characters)" className={`${inputClass} pr-12`} />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base tracking-wide font-bold disabled:opacity-60 mt-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Free Account'}
            </motion.button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Want to sell? You can upgrade to a vendor account after signing up.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
