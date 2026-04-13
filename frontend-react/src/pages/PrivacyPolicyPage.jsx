import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const PrivacyPolicyPage = () => {
  const sections = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Data We Collect",
      content: "We collect information you provide directly to us when you create an account, list a product, or make a purchase. This includes your name, email address, shipping address, and payment information."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Data",
      content: "Your data is used to process transactions, provide customer support, and improve our marketplace. We use industry-standard encryption to ensure your sensitive information remains secure."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection",
      content: "We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Cookies",
      content: "We use cookies to enhance your experience, gather general visitor information, and track visits to our website. This helps us understand your preferences for future visits."
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
            <Shield className="w-4 h-4" /> Legal Center
          </div>
          <h1 className="font-poppins font-black text-5xl sm:text-6xl text-slate-900 dark:text-white mb-6">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
            At Artisan, we value your privacy and are committed to protecting your personal data. 
            This policy outlines how we handle your information.
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
          Last updated: April 12, 2026. For any questions regarding this policy, please contact our support team.
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
