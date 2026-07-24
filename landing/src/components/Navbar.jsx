import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, ChevronDown, Smartphone, Github } from 'lucide-react';

export const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-[#090a0f]/70 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-cyan-300 dark:text-purple-600" />
          </div>
          <span className="font-heading font-black text-2xl tracking-tight text-slate-900 dark:text-white">
            Helix<span className="text-cyan-500 dark:text-cyan-400">Box</span>
          </span>
        </a>

        {/* Center Nav Links with Dropdowns (Agenta Style) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <div className="relative group cursor-pointer flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span>Future of Mobile</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
          </div>
          <div className="relative group cursor-pointer flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span>Features</span>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
          </div>
          <a href="#x402" className="hover:text-slate-900 dark:hover:text-white transition-colors">x402 Protocol</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
        </div>

        {/* Right Actions & Theme Toggle */}
        <div className="flex items-center gap-4">
          {/* Light / Dark Mode Switcher Toggle */}
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
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>

          {/* Agenta Cyan Pill Button */}
          <a
            href="https://github.com/devndesigner6/helix-box/releases/latest/download/helix-boxv1.apk"
            className="agenta-pill-btn px-6 py-2.5 text-sm flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Download APK</span>
          </a>
        </div>

      </nav>
    </header>
  );
};
