import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollProgress from './ScrollProgress';
import ChatbotFAB from './ChatbotFAB';

const Layout = ({ darkMode, setDarkMode }) => (
  <div className={`${darkMode ? 'dark' : ''} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950`}>
    <ScrollProgress />
    <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
    <main className="flex-1 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Outlet />
      </motion.div>
    </main>
    <Footer darkMode={darkMode} />
    <ChatbotFAB />
  </div>
);

export default Layout;
