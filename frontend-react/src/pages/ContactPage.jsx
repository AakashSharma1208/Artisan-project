import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

import { contactService } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' }); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;

    setStatus({ type: 'sending', message: 'Sending...' });

    try {
      await contactService.sendEmail(form);
      setStatus({ type: 'success', message: 'Message sent successfully. We will get back to you shortly!' });
      setForm({ name: '', email: '', subject: '', message: '' });

      // Clear successful message after 5 seconds
      setTimeout(() => setStatus({ type: 'idle', message: '' }), 5000);
    } catch (error) {
      console.error('Failed to send contact message:', error);
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className="dark:bg-slate-950 min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 overflow-hidden">
        <div className="absolute top-10 right-0 w-72 h-72 bg-primary-200 dark:bg-primary-900/30 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="text-primary-600 font-semibold tracking-widest uppercase text-sm mb-4">
            ✦ Get in Touch
          </motion.p>
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-poppins font-black text-5xl sm:text-6xl text-slate-900 dark:text-white mb-5 leading-tight">
            We'd Love to <span className="gradient-text">Hear From You</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Questions, feedback, or partnership ideas — our team is always ready to help.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">

            {/* Left: Info cards */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: <Mail className="w-5 h-5" />, title: 'Email Us', value: 'support@artisan.com', sub: 'We reply within 24 hours' },
                { icon: <Phone className="w-5 h-5" />, title: 'Call Us', value: '+91 98765 43210', sub: 'Mon–Fri, 9am–6pm IST' },
                { icon: <MapPin className="w-5 h-5" />, title: 'Our Office', value: 'Bengaluru, Karnataka', sub: 'India 560001' },
                { icon: <Clock className="w-5 h-5" />, title: 'Support Hours', value: '24/7 Chat Support', sub: 'Via the chatbot on site' },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.title}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right: Form */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" custom={1} viewport={{ once: true }}
              className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white">Send a Message</h2>
              </div>

              {status.type === 'success' && (
                <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                  ✅ {status.message}
                </div>
              )}
              {status.type === 'error' && (
                <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                  ❌ {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Your Name</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                  <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more about your question or request..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none" />
                </div>
                <button type="submit" disabled={status.type === 'sending'}
                  className="w-full btn-primary py-4 text-base justify-center shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 transition-transform rounded-xl disabled:opacity-75 disabled:hover:-translate-y-0 disabled:cursor-not-allowed">
                  {status.type === 'sending' ? (
                    <span className="flex items-center">
                      Sending... 
                      <div className="ml-2 w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message <Send className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
