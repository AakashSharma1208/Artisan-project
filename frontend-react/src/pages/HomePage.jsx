import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Shield, Truck, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { SkeletonGrid } from '../components/SkeletonCard';
import CategoryFilter from '../components/CategoryFilter';
import { productsService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES_ICONS = {
  'Handmade Jewelry': '💎',
  'Pottery': '🏺',
  'Wood Crafts': '🪵',
  'Paintings': '🎨',
  'Handmade Clothing': '🧵',
  'Home Decor': '🕯️',
  'Traditional Art': '🖼️',
};

const WHY = [
  { icon: <Shield className="w-6 h-6" />, title: 'Authentic Craftsmanship', text: 'Every item is carefully handcrafted by vetted artisans.' },
  { icon: <Truck className="w-6 h-6" />, title: 'Worldwide Shipping', text: 'Fast and secure delivery to your doorstep.' },
  { icon: <Star className="w-6 h-6" />, title: 'Premium Quality', text: 'We only list products meeting our quality standards.' },
  { icon: <Award className="w-6 h-6" />, title: 'Support Artisans', text: 'Your purchase directly supports independent makers.' },
];

// Animated hero text
const AnimatedText = ({ text }) => {
  const words = text.split(' ');
  return (
    <span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const HomePage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    productsService.getAll().then(data => {
      setProducts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const featured = products.slice(0, 6);

  // Auto-advance carousel
  useEffect(() => {
    if (featured.length === 0) return;
    const timer = setInterval(() => setFeaturedIdx(i => (i + 1) % Math.max(1, featured.length - 2)), 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  return (
    <div className="dark:bg-slate-950">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
            y: heroY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian/80" />

        {/* Floating orbs */}
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 8, repeat: Infinity, delay: 2 }} className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-primary-500 font-semibold tracking-widest uppercase text-sm mb-6">
            ✦ Handcrafted with Love
          </motion.p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-poppins font-black text-white leading-none mb-6">
            <AnimatedText text="Discover Unique Handmade Creations" />
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }} className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Connect with talented artisans worldwide. Every purchase supports a craftsperson's passion and keeps traditional skills alive.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-primary text-base group">
              Shop Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to={user?.role === 'vendor' ? "/vendor/dashboard" : "/vendor/register"} className="btn-secondary text-base">
              {user?.role === 'vendor' ? 'Manage Shop' : 'Become an Artisan'}
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-slate-400 text-xs tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-0.5 h-8 bg-gradient-to-b from-gold-400 to-transparent" />
        </motion.div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section-padding bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="font-poppins font-bold text-4xl mb-3 dark:text-white">Browse Categories</h2>
            <p className="text-slate-500 dark:text-slate-400">Find your perfect handcrafted piece</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(CATEGORIES_ICONS).map(([cat, icon], i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(230,172,0,0.15)' }}
              >
                <Link to={`/shop?category=${encodeURIComponent(cat)}`} className="glass-card flex flex-col items-center p-6 gap-3 text-center block hover:border-gold-300">
                  <span className="text-4xl">{icon}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{cat}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-poppins font-bold text-4xl dark:text-white">Featured Products</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Handpicked artisan favorites</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFeaturedIdx(i => Math.max(0, i - 1))} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setFeaturedIdx(i => Math.min(featured.length - 3, i + 1))} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
              <Link to="/shop" className="ml-4 text-sm font-medium text-primary-700 hover:text-primary-600 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {loading ? (
            <SkeletonGrid count={6} />
          ) : (
            <div className="overflow-hidden">
              <motion.div
                animate={{ x: `-${featuredIdx * (100 / 3)}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                className="flex gap-6"
                style={{ width: `${(featured.length / 3) * 100}%` }}
              >
                {featured.map((p, i) => (
                  <div key={p._id} style={{ width: `${100 / featured.length}%` }}>
                    <ProductCard product={p} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section-padding bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Why Us</p>
            <h2 className="font-poppins font-bold text-4xl dark:text-white mb-3">
              Why Choose <span className="gradient-text">Artisan?</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">We believe in the power of craftsmanship — connecting makers with the people who'll treasure their work forever.</p>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-300" />
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-primary-100 dark:hover:shadow-primary-900/20 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/40 dark:to-primary-800/20 flex items-center justify-center mx-auto mb-5 text-primary-600 dark:text-primary-400 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white dark:group-hover:from-primary-500 dark:group-hover:to-primary-600 dark:group-hover:text-white transition-all duration-300 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-base">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section-padding bg-luxury-gradient dark:bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="font-poppins font-black text-4xl sm:text-5xl text-slate-900 dark:text-white mb-6">
            Start Selling Your Creations Today
          </motion.h2>
          <p className="text-slate-700 dark:text-slate-200 text-lg mb-10">Join thousands of artisans sharing their craft with the world.</p>
          <Link to={user?.role === 'vendor' ? "/vendor/dashboard" : "/vendor/register"} className="btn-primary text-base">
            {user?.role === 'vendor' ? 'Go to Dashboard' : 'Become an Artisan Seller'} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
