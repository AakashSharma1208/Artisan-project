import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Users, ShoppingBag, AlertCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const TermsOfServicePage = () => {
  const sections = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Obligations",
      content: "As a user of Artisan, you agree to provide accurate information, maintain the security of your account, and use the platform in compliance with all relevant laws and regulations."
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Marketplace Rules",
      content: "All handcrafted goods listed must be authentic. Vendors are responsible for the accuracy of their product descriptions and for shipping items within the specified timeframe."
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: "All content on this platform, including logos, text, and images, is the property of Artisan or its vendors and is protected by copyright laws."
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Liability",
      content: "Artisan acts as a marketplace. We are not liable for disputes between buyers and sellers, although we provide dedicated support to help resolve issues fairly."
    }
  ];

  return (
    <div className="dark:bg-slate-950 min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          variants={fadeUp} initial="hidden" animate="visible"
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold uppercase tracking-widest mb-6">
            <Scale className="w-4 h-4" /> Legal Center
          </div>
          <h1 className="font-poppins font-black text-5xl sm:text-6xl text-slate-900 dark:text-white mb-6">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            Welcome to Artisan. By using our platform, you agree to the following terms and conditions. 
            Please read them carefully.
          </p>
        </motion.div>

        {/* Content */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <motion.section 
              key={i}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/40 rounded-2xl flex items-center justify-center text-primary-600">
                  {section.icon}
                </div>
                <h2 className="font-poppins font-bold text-2xl text-slate-800 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-20 text-center text-slate-400 text-sm italic"
        >
          Last updated: April 12, 2026. Your continued use of the platform constitutes agreement to these terms.
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
