import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Instagram, ArrowRight, Code2, Cpu, LayoutDashboard } from 'lucide-react';

const TEAM = [
  {
    name: 'Aakash Sharma',
    role: 'AI/ML Engineer',
    bio: 'Integrates intelligent features and machine learning pipelines to enhance user experiences.',
    image: '/team/aakash.png',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-violet-500 to-pink-500',
    instagram: 'https://www.instagram.com/aakash_sharma87/',
  },
  {
    name: 'Atharva Kadam',
    role: 'Frontend Developer',
    bio: 'Crafts pixel-perfect, responsive UIs with a deep love for modern design systems and animations.',
    image: '/team/atharva.png',
    icon: <Code2 className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    instagram: 'https://www.instagram.com/atharvaa._5/',
  },
  {
    name: 'Rohan Sawant',
    role: 'Backend Developer',
    bio: 'Architects robust, scalable server-side solutions and databases to power seamless experiences.',
    image: '/team/rohan.jpg',
    icon: <LayoutDashboard className="w-5 h-5" />,
    color: 'from-indigo-500 to-purple-600',
    instagram: 'https://www.instagram.com/rohhhhnn/',
  },
];

const STATS = [
  { value: '500+', label: 'Artisans Onboarded' },
  { value: '10K+', label: 'Products Listed' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '25+', label: 'Cities Covered' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const AboutPage = () => {
  return (
    <div className="dark:bg-slate-950 min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-0 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-4"
          >
            ✦ Our Story
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-poppins font-black text-5xl sm:text-6xl text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Built for <span className="gradient-text">Artisans.</span><br />Designed for People.
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Artisan is a marketplace that bridges the gap between talented craftspeople and customers who value authenticity. We believe every handmade item carries a story — and we're here to share it.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
            <Link to="/shop" className="btn-primary text-base group">
              Explore the Marketplace
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="visible" custom={i}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-poppins font-black text-4xl gradient-text mb-1">{stat.value}</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="section-padding bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">Our Mission</p>
              <h2 className="font-poppins font-bold text-4xl dark:text-white mb-5">
                Empowering Artisans.<br /> Celebrating Craft.
              </h2>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                We started Artisan with a simple belief: handmade items deserve a premium platform. Whether it's pottery from a village in Rajasthan or hand-woven fabric from Kerala, every craft deserves to be discovered.
              </p>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Our technology stack ensures vendors can manage their stores effortlessly — while customers enjoy a seamless, trust-first shopping experience.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {['🏺 Authentic Products', '🌍 Global Reach', '⚡ Fast Delivery', '🔒 Secure Payments', '🤝 Vendor Support', '⭐ Quality First'].map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-3">
                  <span className="text-2xl">{item.split(' ')[0]}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-3">The Builders</p>
            <h2 className="font-poppins font-bold text-4xl dark:text-white mb-3">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              A small but mighty squad of engineers and designers who built Artisan from the ground up.
            </p>
            <div className="mt-4 mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-300" />
          </motion.div>

          {/* Team Grid — 3 columns desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.25 } }}
                className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-primary-100 dark:hover:shadow-primary-900/20 hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  {/* Fallback avatar */}
                  <div
                    className={`hidden absolute inset-0 bg-gradient-to-br ${member.color} items-center justify-center`}
                    style={{ display: 'none' }}
                  >
                    <span className="text-white font-black text-6xl opacity-80 select-none">
                      {member.name[0]}
                    </span>
                  </div>
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/10 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-6">
                  {/* Role badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-gradient-to-r ${member.color} text-white shadow-sm`}>
                    {member.icon}
                    {member.role}
                  </div>

                  <h3 className="font-poppins font-bold text-xl text-slate-800 dark:text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-700 pt-4">
                    <a href={member.instagram} target="_blank" rel="noreferrer"
                      className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white transition-all duration-200">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-indigo-700 dark:from-primary-700 dark:to-indigo-900">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-poppins font-black text-4xl text-white mb-4"
          >
            Want to Join Our Journey?
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
            className="text-primary-100 text-lg mb-8"
          >
            Whether you're an artisan with a craft or a customer who values authenticity — Artisan was built for you.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" custom={2} viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup" className="px-8 py-3.5 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-xl">
              Get Started Free
            </Link>
            <Link to="/vendor/register" className="px-8 py-3.5 bg-primary-700/40 border border-white/30 text-white font-bold rounded-xl hover:bg-primary-700/60 transition-colors backdrop-blur-sm">
              Become a Vendor
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
