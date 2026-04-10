import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = ({ darkMode }) => {
  const links = {
    Explore: [
      { label: 'Home', to: '/' },
      { label: 'Shop', to: '/shop' },
    ],
    Company: [
      { label: 'About', to: '#' },
      { label: 'Contact', to: '#' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms of Service', to: '#' },
    ],
  };

  const socials = [
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Facebook, href: '#' },
    { icon: Youtube, href: '#' },
  ];

  return (
    <footer className={`mt-20 border-t ${darkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800'} text-slate-400`}>
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary-500" />
              <span className="font-poppins font-bold text-2xl gradient-text">Artisan</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Discover unique handcrafted goods from talented artisans around the world. Every piece tells a story.
            </p>
            <div className="flex gap-3 mt-6">
              {socials.map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary-500 flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-semibold text-slate-200 mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm hover:text-primary-500 transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">© {new Date().getFullYear()} Artisan. All rights reserved.</p>
          <p className="text-xs text-slate-700 dark:text-slate-200">Crafted with ❤️ for artisans worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
