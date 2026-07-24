import React, { useState } from 'react';
import { Sun, Moon, Smartphone, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Future of Mobile');

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  const navLinks = [
    { name: 'Future of Mobile', href: '#' },
    { name: 'Capabilities', href: '#features' },
    { name: 'x402 Protocol', href: '#x402' },
    { name: 'Pricing', href: '#pricing' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#090a0f]/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo with Greek Statue Image */}
        <a href="#" className="flex items-center gap-3 group">
          <img 
            src="/helixbox.png" 
            alt="Helix Box Greek Statue Logo" 
            className="w-10 h-10 object-cover rounded-xl shadow-md group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-700" 
          />
          <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white">
            Helix<span className="text-cyan-500">Box</span>
          </span>
        </a>

        {/* KokonutUI Morphic Navbar Pills */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800/80">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setActiveTab(link.name)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === link.name 
                  ? 'text-slate-900 dark:text-slate-900' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {activeTab === link.name && (
                <motion.div
                  layoutId="morphic-pill"
                  className="absolute inset-0 bg-[#A8F1F7] rounded-full shadow-sm"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Right Actions & Theme Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <a
            href="https://github.com/devndesigner6/helix-box"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="agenta-primary-btn px-6 py-2.5 text-xs flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download APK</span>
          </a>
        </div>

      </nav>
    </header>
  );
};
