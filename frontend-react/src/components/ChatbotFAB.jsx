import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { aiService } from '../services/api';

const ChatbotFAB = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! 👋 I\'m your Artisan assistant. How can I help you find the perfect handcrafted item today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const { reply } = await aiService.chat(text);
      setMessages(m => [...m, { role: 'bot', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'bot', text: 'Sorry, I\'m having trouble connecting. Please try again later.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-gradient shadow-primary-lg flex items-center justify-center"
        animate={{ boxShadow: open ? '0 0 0 0 rgba(230, 172, 0, 0)' : ['0 0 0 0 rgba(230,172,0,0.4)', '0 0 0 12px rgba(230,172,0,0)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {open ? <X className="w-6 h-6 text-slate-900 dark:text-white" /> : <Bot className="w-6 h-6 text-slate-900 dark:text-white" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 glass-card overflow-hidden flex flex-col"
            style={{ height: 440 }}
          >
            {/* Header */}
            <div className="bg-gold-gradient px-4 py-3 flex items-center gap-3">
              <Bot className="w-5 h-5 text-slate-900 dark:text-white" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Artisan AI</p>
                <p className="text-xs text-slate-900 dark:text-white/70">Ask me anything about our products</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <span
                    className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-gold-gradient text-slate-900 rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <span className="px-3 py-2 rounded-2xl rounded-tl-none bg-slate-100 dark:bg-slate-800">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                  </span>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about products, shipping..."
                className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 rounded-full px-4 py-2 outline-none border border-slate-200 dark:border-slate-700 focus:border-primary-500"
              />
              <button type="submit" className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 disabled:opacity-50" disabled={loading}>
                <Send className="w-4 h-4 text-slate-900 dark:text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotFAB;
